interface Window {
  google: any;
  FB: any;
  fbAsyncInit: () => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  profile_photo?: string;
}

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: string;
  profile_photo?: string;
  google_token?: string;
  facebook_token?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

interface CourseCardProps {
  title: string;
  description: string;
  imageUrl: string;
  type: string;
  level: string;
  sub_level: string;
}
interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: string;
  level: string;
  sub_level: string;
}
interface UpdateCourseProps {
  id?: string;
}
interface PrivateRouteProps {
  children: React.ReactNode;
}
interface DescriptionProps {
  description?: string;
  cleanDescription?: string;
}
interface CommentSectionProps {
  id: number;
}
// interface User {
//   name: string;
//   profilePicture: string;
// }

interface Comment {
  id: number;
  comment: string;
  user: User;

  likedByUser: boolean;
  userId: number;
}
