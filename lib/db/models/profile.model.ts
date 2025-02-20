import { Schema, Document, model, models } from "mongoose";

export interface IProfile extends Document {
	gender: string;
	dateOfBirth: string;
	about: string;
	contactNumber: number;
	githubUrl: string;
	linkedinUrl: string;
	twitterUrl: string;
	websiteUrl: string;
	profileImage: string;
	location: string;
	occupation: string;
	userId: string;

}


const profileSchema = new Schema({
	gender: {
		type: String,
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
	},
	contactNumber: {
		type: Number,
		trim: true,
	},
});


export const Profile = models?.Profile || model<IProfile>("Profile", profileSchema);