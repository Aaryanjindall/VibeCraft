import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const FileContext = createContext(null)

export const FileProvider = ({ children }) => {
  const [files, setFiles] = useState({})
  const [activeFile, setActiveFile] = useState('index.html')
  const [runFiles, setRunFiles] = useState({})
  const [currentProject, setCurrentProject] = useState(null)
  const [unsaved, setUnsaved] = useState(false)
  const [autoRun, setAutoRun] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  // const {getProjects} = useProject()

  // ✅ file functions
  const createFile = (name) => {
    if (!name || files[name]) return

    setFiles(prev => ({
      ...prev,
      [name]: ''
    }))
    setActiveFile(name)
  }

  const deleteFile = (name) => {
    setFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[name]

      const keys = Object.keys(newFiles)
      if (keys.length > 0) {
        setActiveFile(keys[0])
      }

      return newFiles
    })
  }

  const renameFile = (oldName, newName) => {
    if (!newName || files[newName]) return

    setFiles(prev => {
      const newFiles = { ...prev }
      newFiles[newName] = newFiles[oldName]
      delete newFiles[oldName]
      return newFiles
    })

    if (activeFile === oldName) {
      setActiveFile(newName)
    }
  }

  // ✅ autorun
  useEffect(() => {
    if (autoRun) {
      setRunFiles(files)
    }
  }, [files, autoRun])

  // ✅ unsaved detect
  useEffect(() => {
    if (!files || Object.keys(files).length === 0) return
    if (!currentProject) return

    setUnsaved(true)
  }, [files])

  // ✅ handle save
  const handleSave = async (prompt,status) => {
    try {
      if (!files || Object.keys(files).length === 0) return

      setSaveLoading(true)
      console.log(status);

      const url = currentProject
        ? `http://localhost:5001/api/project/update/${currentProject.id}`
        : `http://localhost:5001/api/project/save`

      const method = currentProject ? 'PUT' : 'POST'
      console.log(method);
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: currentProject?.name || prompt,
          files,
          isPublic: status
        })
      })

      const data = await res.json()
      toast.success("Saved SuccessFully");
      console.log("save hogya");
      if (!currentProject && data.project) {
        setCurrentProject({
          id: data.project._id,
          name: data.project.name
        })
      }

      setUnsaved(false)
    } catch (err) {
      console.log(err)
    } finally {
      setSaveLoading(false)
    }
  }
  
  

  return (
    <FileContext.Provider
      value={{
        files,
        setFiles,
        activeFile,
        setActiveFile,
        runFiles,
        setRunFiles,
        currentProject,
        setCurrentProject,
        unsaved,
        setUnsaved,
        autoRun,
        setAutoRun,
        createFile,
        deleteFile,
        renameFile,
        handleSave,
        saveLoading
      }}
    >
      {children}
    </FileContext.Provider>
  )
}

export const useFiles = () => useContext(FileContext)