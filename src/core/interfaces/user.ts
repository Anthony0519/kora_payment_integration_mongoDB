import { Types } from 'mongoose'

export interface UserAttributes {
    id: string | Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    balance: number;
    image?: string;
    isVerified: boolean;
    isAdmin: boolean;
    password: string;
}

export interface UserRegReq {
    fullName: string;
    email: string;
    phone: string;
    image?: string;
    password: string;
}

export interface UserReqRes {
    message: string;
    user: any;
}

export interface UserLoginReq {
    email: string;
    password: string;
}

export interface UserLoginRes<T> {
    message: string;
    user: T;
}

export interface updateUserProfile {
    fullName?: string;
    phone?: string;
}

export interface GetUserProfileData {
    id: number;
}

export interface UserProfileData extends Partial<UserAttributes> { }

export interface jwtPayload {
    userId: string | Types.ObjectId;
    email: string;
    name: string;
}

export interface LogOutUserRes {
    token: string;
}

export interface UploadedImage {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  }
  
  export interface ImageUploadRequest {
    file?: UploadedImage;
  }