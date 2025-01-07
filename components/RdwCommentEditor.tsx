import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Editor } from "react-draft-wysiwyg";
import { FiMoreVertical } from "react-icons/fi";
import {fetchDataWithOutParam, postData } from "@/utils/api";
import { useSelector } from "react-redux";
import { AddTaskActivity, FormatDate } from "@/utils/common";
import useAddTaskComment from "@/lib/customhooks/useAddTaskComment";
import moment from 'moment';
import Image from "next/image";
import Link from "next/link";
// import { Fancybox } from '@fancyapps/ui';
// import "@fancyapps/ui/dist/fancybox.css";
// Dynamically import the RDW Editor for SSR compatibility
// const Editor = dynamic(
//   () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
//   { ssr: false }
// );



export default function RdwCommentEditor({taskId, project_id, taskComments, refetchTaskComments, refetchTaskActivity, removeComment} : any) {
  const [editorActive, setEditorActive] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [comments, setComments] = useState<any>([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);

  interface EditComment {
    id: number;
    comment: string;
    user_id: string | number;
  }

  const [editComment, setEditComment] = useState<EditComment | null>(null);
  
  const {addComment, isCreating} = useAddTaskComment(refetchTaskComments,refetchTaskActivity, editComment == null ? false : true)

  const user = useSelector((state: any) => state.auth.user);

  const toggleDropdown = (id: any) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  const deleteComment = async (id:any, onSuccess: any) => {
    setDropdownVisible(null); // Close the dropdown

    setIsDeletingComment(true);
    try{
      let {data} = await postData("api/tasks/comment/delete",{
        commentId: id
      })

      if(data.success == true){
        onSuccess(id)
      }
    }catch(err){
      console.log('err---> ',err);
    }finally{
      setIsDeletingComment(false);
    }

   
  };
  
  const removeCommentFromTask = (id: any) => {
    // setComments(comments.filter((comment: any) => comment.id !== id));
    // refetchTaskComments();
    removeComment(id);
    ActivityStats("deleted Comment");
  }

  const ActivityStats = (activityContent: any) => {
    AddTaskActivity(ActivityAddCallBack,{
      user_id: user?.id,
      task_id:taskId,
      project_id:project_id,
      activity: `${activityContent}`,
      activity_type: 1,
      created_at: FormatDate(Date.now()),
      updated_at:FormatDate(Date.now())
    })
  }

  const handleSaveComment = async () => {
    const commentContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    if (commentContent.trim() === "<p></p>") return; // Prevent saving empty comments
    let commentData = {user_id: user?.id, project_id: project_id, task_id: taskId, attachments: "", name: user?.name, comment: commentContent, created_at: "Just Now" }

    setIsAddingComment(true);
    try{

      if(editComment == null){ //add new comment
        // let {data} = await postData("api/tasks/comment/add",commentData)
        // data["response"].created_at = Date.now()
        // data["response"].type = "comment"
        // setComments([
        //   ...comments,
        //   data["response"],
        // ]);

        await addComment(commentData);

        ActivityStats("Added Comment");

      }else{ //otherwise update that comment
        // let {data} = await postData("api/tasks/comment/edit",{
          // comment: commentContent,
          // id: editComment?.id,
          // user_id: editComment?.user_id
        // })

        await addComment({comment: commentContent,
          id: editComment?.id,
          user_id: editComment?.user_id})

        ActivityStats("Updated Comment");
        setEditComment(null);

        
        // if(data["success"] == true){
        //   //reload all comments
        //   LoadComments();
         
        // }

       
      }
    }catch(error){

    }finally{
      setIsAddingComment(false);
    }
    
    refetchTaskActivity();
    setEditorState(EditorState.createEmpty());
    setEditorActive(false);
  };

  const ClosedEditor = () => {
    setEditorState(EditorState.createEmpty());
    setEditorActive(false);
  }

  const ActivityAddCallBack = () => {
    console.log("activity added");
  }

  const onEditorStateChange = (newEditorState: EditorState) => {
    setEditorState(newEditorState);
    console.log('editor---> ',newEditorState);
  };
  const LoadComments = async () => {
    try{
      const {data} = await fetchDataWithOutParam(`api/tasks/comment/${taskId}`)
      setComments(data["response"]);
    }catch(error){

    }
  }

  useEffect(() => {
    if(editComment == null) return;
  // Convert the HTML content to ContentState
  const { contentBlocks, entityMap } = convertFromHTML((editComment as { comment: string })?.comment || '');

  // Create ContentState from the blocks and entity map
  const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

  // Create the editor state from the ContentState
  const newEditorState = EditorState.createWithContent(contentState);
    setEditorState(newEditorState);
    setEditorActive(true);
    toggleDropdown(editComment?.id);
  },[editComment])

  useEffect(() => {
    LoadComments();
  },[])

  // useEffect(() => {
  //   Fancybox.bind("[data-fancybox]", {});
  //   return () => {
  //     Fancybox.destroy();
  //   };
  // }, []);
let dataTime=taskComments && taskComments[0]?.comment.created_at;
// console.log("taskComments",moment(dataTime).fromNow(),taskComments);
console.log("taskComments[0]",taskComments);


  return (
    <>
      <h3 className="font-bold text-ColorDark mb-2 px-6">Comments</h3>
      
      {/* Existing Comments */}
      <div className="pb-8 divide-y divide-separator mx-6">
        {taskComments?.map((comment : any, index: any) => (
          <div key={comment.id} className="flex w-full flex-col gap-2 py-4 text-body-1">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">
                {comment.name.split(" ")[0][0]}
              </div>
              <div className="flex min-w-0 items-center gap-4 flex-grow">
                <p className="truncate flex-1 font-semibold">{comment.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">{moment(dataTime).fromNow()}</p>
                  {/* Three-dots icon */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown(comment.id)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <FiMoreVertical size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownVisible === comment.id && (
                      <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg">
                        {comment.type == "comment" ?
                        <button
                          onClick={() => setEditComment(comment)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                        >
                          Edit
                        </button>
                        :null}
                        <button
                          onClick={() => deleteComment(comment.id, removeCommentFromTask)}
                          className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 pl-11">
              {comment.type == "comment" ?
                <div
                  className="text-gray-800 text-sm"
                  dangerouslySetInnerHTML={{ __html: comment.comment }}
                ></div>
                :
                <Link href={`/uploads/${comment.attachment_url}`} data-fancybox="gallery" target="_blank">
                  <Image src={`/uploads/${comment.attachment_url}`} alt="" width={100} height={100} />
                </Link>
              }
            </div>
            
            

          </div>
        ))}

          
      </div>

      {/* Add Comment UI */}
      <div className="flex space-x-3 !px-8 py-4 bg-[#eff0f6] sticky bottom-0 z-10 shadow-[0_-2px_4px_-0px_#0B0E1E1A]">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">
          AZ
        </div>
        {!editorActive ? (
          <div
            onClick={() => setEditorActive(true)}
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-500 cursor-pointer bg-white"
          >
            Add a comment
          </div>
        ) : (
          <div className="flex-1">
            <div className="border border-gray-500 rounded p-2">
              
               <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
              />
            </div>
            <div className="flex items-center justify-end space-x-2 mt-2">
              <button
                className="px-4 py-2 text-sm text-gray-500"
                onClick={() => ClosedEditor()}
                disabled = {isAddingComment}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded"
                onClick={handleSaveComment}
                disabled = {isAddingComment}
              >
                {isAddingComment ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
