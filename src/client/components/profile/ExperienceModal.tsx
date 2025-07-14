import React from 'react'

interface ExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ExperienceFormData) => void
  initialData?: ExperienceFormData
  isLoading?: boolean
}

export interface ExperienceFormData {
  title: string
  companyName: string
  location: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [form, setForm] = React.useState<ExperienceFormData>(
    initialData || {
      title: '',
      companyName: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    }
  )

  React.useEffect(() => {
    if (initialData) setForm(initialData)
    else setForm({
      title: '',
      companyName: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    })
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
          {initialData ? 'Edit Experience' : 'Add Experience'}
        </h2>
        <form
          onSubmit={e => {
            e.preventDefault()
            onSubmit(form)
          }}
          className="space-y-6"
        >
          <div>
            <label className="block mb-2 font-medium">Job Title</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Company Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium">Start Date</label>
              <input
                type="month"
                value={form.startDate}
                onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                required
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium">End Date</label>
              <input
                type="month"
                value={form.endDate}
                onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))}
                disabled={form.current}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={form.current}
              onChange={e => setForm(f => ({ ...f, current: e.target.checked, endDate: e.target.checked ? '' : f.endDate }))}
              id="current"
              className="mr-2"
            />
            <label htmlFor="current" className="font-medium">I currently work here</label>
          </div>
          <div>
            <label className="block mb-2 font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Experience')}
          </button>
        </form>
      </div>
    </div>
  )
}
