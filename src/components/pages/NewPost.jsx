import { 
    useEffect, 
    useState,
    useRef
} from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



export default function NewPost({ currentUser, setCurrentUser }){
    const [content, setContent] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // Cloudinary 
    const [fileInputState, setFileInputState] = useState('')
    // const [selectedFile, setSelectedFile] = useState('')
    const [previewSource, setPreviewSource] = useState('')
    // const [imageIds, setImagesIds] = useState()
    

    // Multer
    const inputRef = useRef(null)
    const [formImg, setFormImg] = useState('')
    

    const navigate = useNavigate()

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        previewFile(file);
        setFormImg(file)
    }


    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); //Converts the file to a url
        reader.onloadend = () => { //Once the reader is done loading
            setPreviewSource(reader.result);

        }
    }
    
    
    const handleCreate = async (e) => {
		e.preventDefault()
        if(!previewSource) return;
        // uploadImage(previewSource);
		try{
            const formData = new FormData()
            formData.append('image', formImg)
            formData.append('content', content)
            formData.append('userId', currentUser.id)
            const options = {
                headers: {
                    "Content-Type" : "multipart/form-data"
                }
            }
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts`, formData, options)
            if(inputRef) inputRef.current.value = '' 
			setContent("")
            navigate('/posts')
		}catch(err){
			setErrorMessage(err.message)
		}
	}
    // console.log("NEW POST",currentUser)
    return(
        <div>
            <h1>New Post</h1>
            <form>   
                <label htmlFor="content">Content</label>
                <input type="text" name="content" id="content" value={content} onChange={(e) => setContent(e.target.value)}/>

                <label htmlFor="file">File</label>
                <input 
                    type = "file"  
                    name = "image" 
                    id = "image"
                    ref = {inputRef}

                    onChange={handleFileInputChange} 
                    value={fileInputState}    
                />
               
                <button type="submit" style = {{backgroundColor: '#FC6767', width: '150px' }} onClick={handleCreate}>Submit</button>
            </form>
            {previewSource && ( //If previewSource is true, then show the image
                <img 
                src={previewSource} alt="User uploaded image" 
                style={{height: '300px'}}
            />
            )}
        </div>
    )
}