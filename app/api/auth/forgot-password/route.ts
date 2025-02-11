import connectDB from "@/lib/db/connect";
import { User } from "@/lib/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/email/sendEmail";
import { getPasswordResetEmailTemplate } from "@/lib/email/templates";






export async function POST (req:NextRequest){
    try {
        await connectDB();
        const email = await req.json();

        const user = await User.findOne({email});
        if(!user){
            return NextResponse.json(
                {
                    message:"User not found",
                    success:false
                },
                {status:404}
            )
        }

        // generate reset token

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

        //save reset token to user

        user.resetPasswordToken = resetTokenHash;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);

        await user.save();

        //create reset url
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

        const emailSent = await sendEmail({
            to:user.email,
            subject:'Password Reset Request',
            html:getPasswordResetEmailTemplate(resetUrl,user.name)
        })

        if(!emailSent){
            user.resetPasswordToken=undefined
            user.resetPasswordExpires=undefined;
            await user.save();

            return NextResponse.json(
                {
                    error:'Error sending email'
                },
                {
                    status:500
                }
            )
        }

        return NextResponse.json({
            message: 'If an account exists, you will receive a password reset email'
          });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
          );
    }
}