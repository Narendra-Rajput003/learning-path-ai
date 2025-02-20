import { motion } from "framer-motion";
import { User } from "@/lib/db/models/user.model";
import { Profile, IProfile } from "@/lib/db/models/profile.model";
import { 
  Calendar, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Twitter,
  MapPin,
  Briefcase,
  User as UserIcon,
  Link as LinkIcon
} from "lucide-react";
import Image from "next/image";

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  profile: IProfile;
}

export const ProfileCard = ({ user, profile }: ProfileCardProps) => {
  const socialLinks = [
    { icon: Github, url: profile.githubUrl, label: "GitHub" },
    { icon: Linkedin, url: profile.linkedinUrl, label: "LinkedIn" },
    { icon: Twitter, url: profile.twitterUrl, label: "Twitter" },
    { icon: LinkIcon, url: profile.websiteUrl, label: "Website" },
  ].filter(link => link.url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="relative">
        {/* Background Header */}
        <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-xl" />
        
        {/* Profile Content */}
        <div className="bg-white rounded-xl shadow-xl -mt-20 mx-4 relative z-10">
          <div className="px-6 py-8">
            {/* Profile Image and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={user.image || "/default-avatar.png"}
                    alt={user.name || "Profile"}
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </motion.div>

              <div className="text-center md:text-left flex-1">
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-gray-800"
                >
                  {user.name}
                </motion.h1>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-2 text-gray-600 flex flex-wrap gap-4"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  {profile.contactNumber && (
                    <span className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {profile.contactNumber}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>

            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">
                {profile.about || "No bio provided yet."}
              </p>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                {profile.gender && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <UserIcon className="w-5 h-5" />
                    <span>{profile.gender}</span>
                  </div>
                )}
                {profile.dateOfBirth && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span>{profile.dateOfBirth}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.occupation && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Briefcase className="w-5 h-5" />
                    <span>{profile.occupation}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
