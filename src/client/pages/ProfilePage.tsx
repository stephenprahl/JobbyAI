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
import { ExperienceFormData, ExperienceModal } from '../components/profile/ExperienceModal'
import { SkillFormData, SkillModal } from '../components/profile/SkillModal'
import { useAuth } from '../contexts/AuthContext'
import {
  addUserExperience,
  addUserSkill,
  deleteUserExperience,
  deleteUserSkill,
  getCurrentUser,
  getUserSkills,
  updateUserExperience,
  updateUserProfile,
  updateUserSkill
} from '../services/api'

const ProfilePage: React.FC = () => {
  // Skill modal state
  // Experience modal state
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<any | null>(null)
  const [isExperienceSaving, setIsExperienceSaving] = useState(false)
  // Handlers for Experience Modal
  const handleAddExperience = () => {
    setEditingExperience(null)
    setIsExperienceModalOpen(true)
  }
  const handleEditExperience = (exp: any) => {
    setEditingExperience(exp)
    setIsExperienceModalOpen(true)
  }
  const handleCloseExperienceModal = () => {
    setIsExperienceModalOpen(false)
    setEditingExperience(null)
  }
  // Add/Edit Experience handler (real API)
  const handleSubmitExperience = async (data: ExperienceFormData) => {
    setIsExperienceSaving(true)
    try {
      if (editingExperience && editingExperience.id) {
        await updateUserExperience(editingExperience.id, data)
      } else {
        await addUserExperience(data)
      }
      queryClient.invalidateQueries(['user-profile'])
      setIsExperienceModalOpen(false)
      setEditingExperience(null)
    } catch (error) {
      console.error('Error saving experience:', error)
    } finally {
      setIsExperienceSaving(false)
    }
  }

  // Delete Experience handler (real API)
  const handleDeleteExperience = async (experienceId: string) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return
    try {
      await deleteUserExperience(experienceId)
      queryClient.invalidateQueries(['user-profile'])
    } catch (error) {
      console.error('Error deleting experience:', error)
    }
  }
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<any | null>(null)
  const [isSkillSaving, setIsSkillSaving] = useState(false)
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 flex justify-center items-center">
        <div className="text-center p-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-gray-200/60 dark:border-gray-600/60 shadow-2xl">
          <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-200 font-semibold">Loading your profile...</p>
        </div>
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

  // Handlers for Skill Modal
  const handleAddSkill = () => {
    setEditingSkill(null)
    setIsSkillModalOpen(true)
  }
  const handleEditSkill = (skill: any) => {
    setEditingSkill(skill)
    setIsSkillModalOpen(true)
  }
  const handleCloseSkillModal = () => {
    setIsSkillModalOpen(false)
    setEditingSkill(null)
  }
  // Add/Edit Skill handler (real API)
  const handleSubmitSkill = async (data: SkillFormData) => {
    setIsSkillSaving(true)
    try {
      if (editingSkill && editingSkill.skillId) {
        await updateUserSkill(editingSkill.skillId, data)
      } else {
        await addUserSkill(data)
      }
      queryClient.invalidateQueries(['user-skills'])
      setIsSkillModalOpen(false)
      setEditingSkill(null)
    } catch (error) {
      console.error('Error saving skill:', error)
    } finally {
      setIsSkillSaving(false)
    }
  }

  // Delete Skill handler (real API)
  const handleDeleteSkill = async (skillId: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return
    try {
      await deleteUserSkill(skillId)
      queryClient.invalidateQueries(['user-skills'])
    } catch (error) {
      console.error('Error deleting skill:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/60 dark:border-gray-600/60 shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/20">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-28 h-28 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl border-4 border-white dark:border-gray-700">
                  {getInitials(userName)}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-grow space-y-3">
                <h1 className="text-4xl font-black text-gray-950 dark:text-white tracking-tight bg-gradient-to-r from-gray-900 via-primary-800 to-purple-800 dark:from-white dark:via-primary-200 dark:to-purple-200 bg-clip-text text-transparent">
                  {userName}
                </h1>
                {profile?.headline && (
                  <p className="text-xl text-gray-800 dark:text-gray-100 font-semibold leading-relaxed">
                    {profile.headline}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700 dark:text-gray-200 font-medium">
                  {user?.email && (
                    <div className="flex items-center space-x-2">
                      <FiMail className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <span>{user.email}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center space-x-2">
                      <FiMapPin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
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
                    className="group relative bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 hover:from-primary-500 hover:via-primary-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-500/50 backdrop-blur-sm flex items-center space-x-2"
                  >
                    <FiEdit className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSubmit(onSubmit)}
                      className="group relative bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 hover:from-green-500 hover:via-green-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-green-500/50 backdrop-blur-sm flex items-center space-x-2"
                      disabled={updateProfileMutation.isLoading}
                    >
                      <FiSave className="w-5 h-5" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="group relative bg-white/90 dark:bg-gray-700/90 backdrop-blur-xl text-gray-700 dark:text-gray-200 font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 flex items-center space-x-2"
                    >
                      <FiX className="w-5 h-5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/60 dark:border-gray-600/60 shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/20">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-gray-950 dark:text-white mb-3 tracking-tight">
                Basic Information
              </h2>
              <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">
                Manage your personal information and contact details
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="profile-label">First Name</label>
                  <input
                    type="text"
                    defaultValue={user?.firstName}
                    readOnly={!isEditing}
                    className="profile-input"
                  />
                </div>
                <div>
                  <label className="profile-label">Last Name</label>
                  <input
                    type="text"
                    defaultValue={user?.lastName}
                    readOnly={!isEditing}
                    className="profile-input"
                  />
                </div>
                <div>
                  <label className="profile-label">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      readOnly
                      className="profile-input pl-12"
                    />
                  </div>
                </div>
                <div>
                  <label className="profile-label">Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMapPin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <input
                      type="text"
                      {...register('location')}
                      readOnly={!isEditing}
                      placeholder="Your location"
                      className="profile-input pl-12"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="profile-label">Professional Headline</label>
                  <input
                    type="text"
                    {...register('headline')}
                    readOnly={!isEditing}
                    placeholder="e.g., Senior Software Engineer at Tech Corp"
                    className="profile-input"
                  />
                </div>
                <div>
                  <label className="profile-label">Professional Summary</label>
                  <textarea
                    {...register('summary')}
                    readOnly={!isEditing}
                    rows={5}
                    placeholder="Brief description of your professional background and expertise..."
                    className="profile-textarea"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-6 tracking-tight">
                  Social Links
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="profile-label">Website URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiGlobe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <input
                        type="url"
                        {...register('websiteUrl')}
                        readOnly={!isEditing}
                        placeholder="https://yourwebsite.com"
                        className="profile-input pl-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="profile-label">LinkedIn URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiLinkedin className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <input
                        type="url"
                        {...register('linkedinUrl')}
                        readOnly={!isEditing}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="profile-input pl-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="profile-label">GitHub URL</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiGithub className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <input
                        type="url"
                        {...register('githubUrl')}
                        readOnly={!isEditing}
                        placeholder="https://github.com/yourusername"
                        className="profile-input pl-12"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Skills */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/60 dark:border-gray-600/60 shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-950 dark:text-white mb-3 tracking-tight">
                  Skills
                </h2>
                <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">
                  Your technical and professional skills
                </p>
              </div>
              <button
                className="group relative bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 hover:from-primary-500 hover:via-primary-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-500/50 backdrop-blur-sm flex items-center space-x-2"
                onClick={handleAddSkill}
              >
                <FiPlus className="w-5 h-5" />
                <span>Add Skill</span>
              </button>
            </div>

            {skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.map((skill) => (
                  <div key={skill.skillId} className="group p-6 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-700/90 dark:to-gray-800/90 backdrop-blur-xl border-2 border-gray-200/60 dark:border-gray-600/60 rounded-2xl hover:shadow-2xl hover:border-primary-300/60 dark:hover:border-primary-500/60 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary-500/5 dark:shadow-primary-500/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg text-gray-950 dark:text-white mb-3 tracking-tight">
                          {skill.name}
                        </h3>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 text-sm font-bold rounded-full ${getLevelColor(skill.level)}`}>
                            {skill.level}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-200 font-semibold">
                            {skill.yearsOfExperience} years
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          onClick={() => handleEditSkill(skill)}
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-gray-700 dark:text-gray-200 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          onClick={() => handleDeleteSkill(skill.skillId)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50/50 to-primary-50/50 dark:from-gray-700/50 dark:to-primary-900/50 rounded-2xl border border-gray-200/30 dark:border-gray-600/30">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUser className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-black text-gray-950 dark:text-white mb-2">No skills added yet</h3>
                <p className="text-gray-700 dark:text-gray-200 mb-4 font-medium">
                  Add your technical and professional skills to showcase your expertise.
                </p>
                <button
                  className="group relative bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 hover:from-primary-500 hover:via-primary-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-500/50 backdrop-blur-sm flex items-center space-x-2 mx-auto"
                  onClick={handleAddSkill}
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Add Your First Skill</span>
                </button>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/60 dark:border-gray-600/60 shadow-2xl shadow-primary-500/10 dark:shadow-primary-500/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-950 dark:text-white mb-3 tracking-tight">
                  Work Experience
                </h2>
                <p className="text-gray-700 dark:text-gray-200 text-lg font-medium">
                  Your professional work history
                </p>
              </div>
              <button
                className="group relative bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 hover:from-primary-500 hover:via-primary-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-500/50 backdrop-blur-sm flex items-center space-x-2"
                onClick={handleAddExperience}
              >
                <FiPlus className="w-5 h-5" />
                <span>Add Experience</span>
              </button>
            </div>

            {experiences.length > 0 ? (
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={exp.id} className="group">
                    <div className="flex items-start justify-between">
                      <div className="flex-grow space-y-4">
                        <div className="flex items-start space-x-6">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <FiBriefcase className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-2 tracking-tight">
                              {exp.title}
                            </h3>
                            <p className="text-gray-800 dark:text-gray-100 font-bold text-lg mb-3">
                              {exp.companyName}
                            </p>
                            <div className="flex items-center space-x-6 text-sm text-gray-700 dark:text-gray-200 mb-4">
                              <div className="flex items-center space-x-2 font-semibold">
                                <FiMapPin className="w-4 h-4" />
                                <span>{exp.location}</span>
                              </div>
                              <div className="flex items-center space-x-2 font-semibold">
                                <FiCalendar className="w-4 h-4" />
                                <span>
                                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate!)}
                                </span>
                              </div>
                              {exp.current && (
                                <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                                  Current
                                </span>
                              )}
                            </div>
                            {exp.description && (
                              <p className="text-gray-800 dark:text-gray-100 leading-relaxed font-medium">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-3 text-gray-700 dark:text-gray-200 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                          onClick={() => handleEditExperience(exp)}
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-3 text-gray-700 dark:text-gray-200 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          onClick={() => handleDeleteExperience(exp.id)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {index < experiences.length - 1 && (
                      <div className="border-b border-gray-200 dark:border-gray-700 mt-8"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50/50 to-primary-50/50 dark:from-gray-700/50 dark:to-primary-900/50 rounded-2xl border border-gray-200/30 dark:border-gray-600/30">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBriefcase className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-black text-gray-950 dark:text-white mb-2">No experience added yet</h3>
                <p className="text-gray-700 dark:text-gray-200 mb-4 font-medium">
                  Add your work experience to showcase your professional background.
                </p>
                <button
                  className="group relative bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 hover:from-primary-500 hover:via-primary-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-primary-500/50 backdrop-blur-sm flex items-center space-x-2 mx-auto"
                  onClick={handleAddExperience}
                >
                  <FiPlus className="w-5 h-5" />
                  <span>Add Your First Experience</span>
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Experience Modal Integration */}
        <ExperienceModal
          isOpen={isExperienceModalOpen}
          onClose={handleCloseExperienceModal}
          onSubmit={handleSubmitExperience}
          initialData={editingExperience ? {
            title: editingExperience.title,
            companyName: editingExperience.companyName,
            location: editingExperience.location,
            startDate: editingExperience.startDate,
            endDate: editingExperience.endDate,
            current: editingExperience.current,
            description: editingExperience.description,
          } : undefined}
          isLoading={isExperienceSaving}
        />
        {/* Skill Modal Integration */}
        <SkillModal
          isOpen={isSkillModalOpen}
          onClose={handleCloseSkillModal}
          onSubmit={handleSubmitSkill}
          initialData={editingSkill ? {
            name: editingSkill.name,
            level: editingSkill.level,
            yearsOfExperience: editingSkill.yearsOfExperience,
          } : undefined}
          isLoading={isSkillSaving}
        />
      </div>
    </div>
  )
}

export default ProfilePage
