import * as mongoose from 'mongoose';

interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
}

type UserModel = mongoose.Model<UserDoc>;

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
