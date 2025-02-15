import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { User } from '@/lib/db/models/user.model';
import connectDB from '@/lib/db/connect';
import { Profile } from '@/lib/db/models/profile.model';
import imagekit from '@/lib/imagekit';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Extract the updated fields from the request body
    const { dateOfBirth, about, contactNumber, gender } = await req.json();

    // Find the user and their profile
    const userDetails = await User.findById(session.user.id);
    if (!userDetails) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const profile = await Profile.findById(userDetails.additionalDetails);
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.contactNumber = contactNumber;
    profile.gender = gender;

    // Save the updated profile
    await profile.save();

    // Fetch the updated user details with the populated profile
    const updatedUserDetails = await User.findById(session.user.id)
      .populate("additionalDetails")
      .exec();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Error in updating profile"
      },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    // Find the user and their profile

    const userDetails = await User.findById(session.user.id);
    const profile = await Profile.findById(userDetails.additionalDetails);

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    // Delete the profile
    await profile.deleteOne();

    // Delete the user
    await userDetails.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
    })
  }catch(error){
    console.log(error);
    return NextResponse.json(
      {
        error: "Error in deleting profile"
      },
      { status: 500 }
    );
  }
}

export async function updateImage(req:NextRequest){
  try {

    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const file = await req.formData();
    const image = file.get('image');
    const fileName = (image as File)?.name || 'default.jpg';
    const folder = 'general';

    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    const uploadResponse = await imagekit.upload({
      file: image as any,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Error in updating profile"
      },
      { status: 500 }
    );
    
  }
}