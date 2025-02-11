import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import imagekit from '@/lib/imagekit';

const uploadSchema = z.object({
  file: z.string(),
  fileName: z.string(),
  folder: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validatedData = uploadSchema.parse(body);

    const uploadResponse = await imagekit.upload({
      file: validatedData.file,
      fileName: validatedData.fileName,
      folder: validatedData.folder || 'general',
      tags: validatedData.tags,
      useUniqueFileName: true,
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { fileId } = await req.json();
    await imagekit.deleteFile(fileId);

    return NextResponse.json({
      message: 'Image deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}