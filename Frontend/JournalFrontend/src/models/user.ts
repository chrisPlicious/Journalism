export interface UserProfile {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  avatarUrl: string;
}

export interface UserProfileUpdateDto {
  userName: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  avatarUrl: string;
}
