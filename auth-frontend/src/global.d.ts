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
  isAuthenticated: boolean;
}
interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: string;
  level: string;
  sub_level: string;
  isAuthenticated: boolean;
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

interface Comment {
  id: number;
  comment: string;
  user: User;
  isLiked: boolean;
  likeCount: number;
}
// interface Comment {
//   id: number;
//   user: {
//     name: string;
//     profile_photo: string;
//   };
//   comment: string;
//   likes: number;
//   likedByUser: boolean;
// }

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}
interface ValidationErrors {
  name?: string[];
  email: string[];
  message: string[];
}
interface Testimonial {
  id: number;
  name: string;
  comment: string;
  image: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface Stats {
  students: number;
  courses: number;
  ratings: number;
  experience: number;
}
