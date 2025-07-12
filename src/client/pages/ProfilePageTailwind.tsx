import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  FiBriefcase,
  FiCalendar,
  FiEdit,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUser,
  FiX
} from 'react-icons/fi'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useAuth } from '../contexts/AuthContext'
import { getCurrentUser, getUserSkills, updateUserProfile } from '../services/api'

const ProfilePageTailwind: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const queryClient = useQueryClient()

  // Fetch user profile data
  const { data: userProfile, isLoading: profileLoading } = useQuery(
    ['user-profile'],
    () => getCurrentUser(),
    {
      enabled: !!user,
      onError: (error) => {
        console.error('Error fetching user profile:', error)
      }
    }
  )

  // Fetch user skills
  const { data: userSkills, isLoading: skillsLoading } = useQuery(
    ['user-skills'],
    () => getUserSkills(),
    {
      enabled: !!user,
      onError: (error) => {
        console.error('Error fetching skills:', error)
      }
    }
  )

  // Update profile mutation
  const updateProfileMutation = useMutation(
    (updates: any) => updateUserProfile(updates),
    {
      onSuccess: () => {
        setIsEditing(false)
        queryClient.invalidateQueries(['user-profile'])
      },
      onError: (error) => {
        console.error('Error updating profile:', error)
      }
    }
  )

  const { register, handleSubmit, reset } = useForm()

  // Set form defaults when profile data loads
  useEffect(() => {
    if (userProfile?.data?.profile) {
      reset({
        headline: userProfile.data.profile.headline || '',
        summary: userProfile.data.profile.summary || '',
        location: userProfile.data.profile.location || '',
        websiteUrl: userProfile.data.profile.websiteUrl || '',
        linkedinUrl: userProfile.data.profile.linkedinUrl || '',
        githubUrl: userProfile.data.profile.githubUrl || '',
      })
    }
  }, [userProfile, reset])

  const onSubmit = async (data: any) => {
    updateProfileMutation.mutate({
      profile: {
        headline: data.headline,
        summary: data.summary,
        location: data.location,
        websiteUrl: data.websiteUrl,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
      }
    })
  }

  const handleCancel = () => {
    if (userProfile?.data?.profile) {
      reset({
        headline: userProfile.data.profile.headline || '',
        summary: userProfile.data.profile.summary || '',
        location: userProfile.data.profile.location || '',
        websiteUrl: userProfile.data.profile.websiteUrl || '',
        linkedinUrl: userProfile.data.profile.linkedinUrl || '',
        githubUrl: userProfile.data.profile.githubUrl || '',
      })
    }
    setIsEditing(false)
  }

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const profile = userProfile?.data?.profile
  const skills = userSkills?.data || []
  const experiences = userProfile?.data?.experiences || []

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'EXPERT': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'ADVANCED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'BEGINNER': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const userName = user?.firstName && user?.lastName
    ? `${user.firstName} ${user.lastName}`
    : user?.email || 'User'

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitials(userName)}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-grow space-y-2">
              <h1 className="text-3xl font-bold text-gray-950 dark:text-white">
                {userName}
              </h1>
              {profile?.headline && (
                <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">
                  {profile.headline}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                {user?.email && (
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {profile?.location && (
                  <div className="flex items-center space-x-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <FiEdit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="btn btn-primary flex items-center space-x-2"
                    disabled={updateProfileMutation.isLoading}
                  >
                    <FiSave className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="btn btn-outline flex items-center space-x-2"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="card">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">
              Basic Information
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your personal information and contact details
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  defaultValue={user?.firstName}
                  readOnly={!isEditing}
                  className={`input ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  defaultValue={user?.lastName}
                  readOnly={!isEditing}
                  className={`input ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="form-label">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    readOnly
                    className="input pl-10 bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="form-label">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMapPin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <input
                    type="text"
                    {...register('location')}
                    readOnly={!isEditing}
                    placeholder="Your location"
                    className={`input pl-10 ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="form-label">Professional Headline</label>
                <input
                  type="text"
                  {...register('headline')}
                  readOnly={!isEditing}
                  placeholder="e.g., Senior Software Engineer at Tech Corp"
                  className={`input ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className="form-label">Professional Summary</label>
                <textarea
                  {...register('summary')}
                  readOnly={!isEditing}
                  rows={4}
                  placeholder="Brief description of your professional background and expertise..."
                  className={`form-textarea ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-4">
                Social Links
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Website URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGlobe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <input
                      type="url"
                      {...register('websiteUrl')}
                      readOnly={!isEditing}
                      placeholder="https://yourwebsite.com"
                      className={`input pl-10 ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">LinkedIn URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLinkedin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <input
                      type="url"
                      {...register('linkedinUrl')}
                      readOnly={!isEditing}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={`input pl-10 ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">GitHub URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiGithub className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <input
                      type="url"
                      {...register('githubUrl')}
                      readOnly={!isEditing}
                      placeholder="https://github.com/yourusername"
                      className={`input pl-10 ${!isEditing ? 'bg-gray-50 dark:bg-gray-700 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Skills */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">
                Skills
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your technical and professional skills
              </p>
            </div>
            <button className="btn btn-outline flex items-center space-x-2">
              <FiPlus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>

          {skills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.skillId} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-950 dark:text-white mb-2">
                        {skill.name}
                      </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {skill.yearsOfExperience} years
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUser className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-950 dark:text-white mb-2">No skills added yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Add your technical and professional skills to showcase your expertise.
              </p>
              <button className="btn btn-primary flex items-center space-x-2 mx-auto">
                <FiPlus className="w-4 h-4" />
                <span>Add Your First Skill</span>
              </button>
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">
                Work Experience
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Your professional work history
              </p>
            </div>
            <button className="btn btn-outline flex items-center space-x-2">
              <FiPlus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </div>

          {experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={exp.id} className="group">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow space-y-3">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiBriefcase className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-gray-950 dark:text-white">
                            {exp.title}
                          </h3>
                          <p className="text-gray-700 dark:text-gray-200 font-medium">
                            {exp.companyName}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mt-2">
                            <div className="flex items-center space-x-1">
                              <FiMapPin className="w-4 h-4" />
                              <span>{exp.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiCalendar className="w-4 h-4" />
                              <span>
                                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                              </span>
                            </div>
                            {exp.current && (
                              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-gray-700 dark:text-gray-200 mt-3 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {index < experiences.length - 1 && (
                    <div className="border-b border-gray-200 dark:border-gray-700 mt-6"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="w-8 h-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-950 dark:text-white mb-2">No experience added yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Add your work experience to showcase your professional background.
              </p>
              <button className="btn btn-primary flex items-center space-x-2 mx-auto">
                <FiPlus className="w-4 h-4" />
                <span>Add Your First Experience</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePageTailwind
