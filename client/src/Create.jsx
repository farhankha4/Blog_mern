import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['link', 'image', 'video'],
    [{ 'color': [] }, { 'background': [] }],
    ["clean"]
  ],
};
    const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'indent',
    'link', 'image','color','background','video'
  ];
export default function Create(){
    const [title,setTitle] = useState('');
    const [summary,setSummary]= useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    async function CreatePost(e){
        console.log(files)
        const data = new FormData;
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        data.set('file',files[0]);
        e.preventDefault();
        const response = await fetch("http://localhost:4000/post",{
            method:'post',
            body: data
        });
    }

    
    return(
        <form onSubmit={CreatePost} className="flex flex-col mx-auto max-w-2xl mt-10 ">
            <input type="text" className= 'w-full block border-3 px-3 mb-2 border-[#9ca3af] rounded-lg focus:outline-none' placeholder="Title" value = {title} onChange={(e)=>setTitle(e.target.value)}/>
            <input type="text" className= 'w-full block px-3 mb-2 border-3 border-[#9ca3af] rounded-lg focus:outline-none' value={summary} onChange={(e)=>setSummary(e.target.value)} placeholder="Summary" />
            <input type="file" onChange={e=> setFiles(e.target.files)} className="border-3 border-[#9ca3af] px-4 w-40 rounded-lg cursor-pointer hover:bg-gray-300 transition duration-300 mb-3"/>
            <ReactQuill modules={modules} 
            formats={formats} 
            className="h-70"
            value={content}
            onChange={newValue => setContent(newValue)}/>
            <button className="bg-[#474747] border-3-[#474747] cursor-pointer rounded-md text-white transition active:scale-95  w-50 h-10 self-center mt-20">Create Post</button>
        </form>
    )
}