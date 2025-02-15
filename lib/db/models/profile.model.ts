import { Schema, Document, model, models } from "mongoose";

export interface IProfile extends Document {
	gender: string;
	dateOfBirth: string;
	about: string;
	contactNumber: number;
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