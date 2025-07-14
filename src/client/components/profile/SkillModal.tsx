import React from 'react'

interface SkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: SkillFormData) => void
  initialData?: SkillFormData
  isLoading?: boolean
}

export interface SkillFormData {
  name: string
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  yearsOfExperience: number
}

const levels = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
  'EXPERT',
] as const

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [form, setForm] = React.useState<SkillFormData>(
    initialData || { name: '', level: 'BEGINNER', yearsOfExperience: 1 }
  )

  React.useEffect(() => {
    if (initialData) setForm(initialData)
    else setForm({ name: '', level: 'BEGINNER', yearsOfExperience: 1 })
  }, [initialData, isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {initialData ? 'Edit Skill' : 'Add Skill'}
        </h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            onSubmit(form)
          }}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 font-medium">Skill Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Level</label>
            <select
              value={form.level}
              onChange={e => setForm(f => ({ ...f, level: e.target.value as SkillFormData['level'] }))}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {levels.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Years of Experience</label>
            <input
              type="number"
              min={0}
              max={50}
              value={form.yearsOfExperience}
              onChange={e => setForm(f => ({ ...f, yearsOfExperience: Number(e.target.value) }))}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Skill')}
          </button>
        </form>
      </div>
    </div>
  )
}
