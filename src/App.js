import './App.css';
import {useEffect,useState} from "react"
//import initialdata from "./data.json"
import amyrobson from "./images/avatars/image-amyrobson.png"
import juliusomo from "./images/avatars/image-juliusomo.png"
import maxblagun from "./images/avatars/image-maxblagun.png"
import ramsesmiron from "./images/avatars/image-ramsesmiron.png"
import {IoAdd, IoRemove} from "react-icons/io5"
import { ReactComponent as Plus } from "./images/icon-plus.svg"
import { ReactComponent as Minus } from "./images/icon-minus.svg"
import { ReactComponent as Reply } from "./images/icon-reply.svg"
import { ReactComponent as Delete } from "./images/icon-delete.svg"
import { ReactComponent as Edit } from "./images/icon-edit.svg"
import uuid from 'react-uuid';
import Modal from 'react-modal';

const initialdata = {
  "currentUser": {
    "image": { 
      "png": "./images/avatars/image-juliusomo.png",
      "webp": "./images/avatars/image-juliusomo.webp"
    },
    "username": "juliusomo"
  },
  "comments": [
    {
      "id": 1,
      "content": "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      "createdAt": "1 month ago",
      "score": 12,
      "user": {
        "image": { 
          "png": "./images/avatars/image-amyrobson.png",
          "webp": "./images/avatars/image-amyrobson.webp"
        },
        "username": "amyrobson"
      },
      "replies": []
    },
    {
      "id": 2,
      "content": "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      "createdAt": "2 weeks ago",
      "score": 5,
      "user": {
        "image": { 
          "png": "./images/avatars/image-maxblagun.png",
          "webp": "./images/avatars/image-maxblagun.webp"
        },
        "username": "maxblagun"
      },
      "replies": [
        {
          "id": 3,
          "content": "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          "createdAt": "1 week ago",
          "score": 4,
          "replyingTo": "maxblagun",
          "user": {
            "image": { 
              "png": "./images/avatars/image-ramsesmiron.png",
              "webp": "./images/avatars/image-ramsesmiron.webp"
            },
            "username": "ramsesmiron"
          }
        },
        {
          "id": 4,
          "content": "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
          "createdAt": "2 days ago",
          "score": 2,
          "replyingTo": "ramsesmiron",
          "user": {
            "image": { 
              "png": "./images/avatars/image-juliusomo.png",
              "webp": "./images/avatars/image-juliusomo.webp"
            },
            "username": "juliusomo"
          }
        }
      ]
    }
  ]
}

function App() {

  const [newData,setNewData] = useState([])
  const [comment,setComment] = useState('')
  const [editcomment,setEditComment] = useState('')
  
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(()=>{
    localStorage.setItem('data', JSON.stringify(initialdata));
    const data = JSON.parse(localStorage.getItem('data'));
    
    if (data) {
      const {comments} = data
      comments.sort((a,b)=>{return b.score-a.score})
      let sortedData = {...data,comments}
      setNewData(sortedData);
      
    }

  },[])

  const onSubmitComment =()=>{
    const timestamp = Date.now()
    const time = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp)
    const newComment = {
      "id": uuid(),
      "content": comment,
      "createdAt": time,
      "score": 1,
      "user": {
        "image": { 
          "png": "./images/avatars/image-juliusomo.png",
          "webp": "./images/avatars/image-juliusomo.webp"
        },
        "username": "juliusomo"
      },
      "replies": [],
      "editMode":false,
      "reply" : false,
    }
    let updatedNewComments = [...newData.comments,newComment]
    setNewData({...newData,comments:updatedNewComments})
    localStorage.setItem('data', JSON.stringify({...newData,comments:updatedNewComments}));
    setComment('')
  }
  

  const openModal=()=> {
    setIsOpen(true);
  }

  const afterOpenModal=()=> {
    // references are now sync'd and can be accessed.
  }

  const closeModal=()=> {
    setIsOpen(false);
  }

  const getComment=(item,commentId)=>{
    const isReplyComment = item.replyingTo ? true:false
    return(
      <div>
      <div className='comment-container'>
        <div className='score-container score-container-desktop'>
              <Plus className='score-icon' onClick={()=>{
                item.score = item.score+1
                let updatedComments = newData.comments.map(eachItem=>{
                  if(eachItem.id===item.id){
                    return item
                  }
                  return eachItem
                })
                let updatedData = {...newData,updatedComments}
                setNewData(updatedData)
                localStorage.setItem('data', JSON.stringify(newData));
              }}/>
              <span className='score'>{item.score}</span>
              <Minus className='score-icon' onClick={()=>{
                item.score = item.score-1
                let updatedComments = newData.comments.map(eachItem=>{
                  if(eachItem.id===item.id){
                    return item
                  }
                  return eachItem
                })
                let updatedData = {...newData,comments:updatedComments}
                setNewData(updatedData)
                localStorage.setItem('data', JSON.stringify(newData));
              }}/>
        </div>
        <div style={{width:'100%'}}>
          <div className='profile-container'>
            <img src={require(`${item.user.image.png}`)} alt={item.user.username} className='profile-img'/>
            <p className='username-text'>{item.user.username}</p>
            <p>{item.createdAt}</p>
            <div className='control-buttons-container-desktop'>
              {
                item.user.username==='juliusomo' ? <div className='user-control-buttons-container'>
                <div>
                  <button className='delete-button' onClick={openModal}>
                    <Delete className='delete-icon'/>
                    <span>Delete</span>
                  </button>
                  <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    className="modal-delete"
                    style={{
                      overlay: {
                        backgroundColor: 'hsla(0, 0%, 43%, 0.4)'
                      },
                      content: {
                        color: 'hsl(211, 10%, 45%)'
                      }
                    }}
                  >
                    <div className='modal-container'>
                      <h2>Delete comment</h2>
                      <p>Are you sure you want to delete this comment? This will remove the comment and can't be undeon</p>
                      <div className='modal-buttons-container'>
                        <button onClick={closeModal} className='delete-button modal-cancel-button'>NO, CANCEL</button>
                        <button className='delete-button modal-delete-button' onClick={()=>{
                          const comments = newData.comments
                          const updatedComments = comments.filter((eachComment)=>{
                            if(eachComment.id!==item.id){
                              return true
                            }
                            return false
                          })
                          const updatedComments1 = comments.map(eachComment=>{
                            const updatedReplies= eachComment.replies.filter(eachReply=>{
                              if(eachReply.id!==item.id){
                                return true
                              }
                              return false
                            })
                            const updatedComment = {...eachComment,replies:updatedReplies}
                            return updatedComment
                          })
                
                          let updatedData = {}
                          if(isReplyComment){
                            updatedData = {...newData,comments:updatedComments1}
                            
                          }
                          else{
                            updatedData = {...newData,comments:updatedComments}
                          }
                          
                          setNewData(updatedData)
                          localStorage.setItem('data', JSON.stringify(updatedData));
                          closeModal()
                        }}>
                          YES, DELETE
                        </button>
                      </div>
                    </div>
                    
                  </Modal>
                </div>

                <button className='reply-activate-button' onClick={()=>{
                  const comments = newData.comments
                  const updatedComments = comments.map(eachComment=>{
                    if(eachComment.id===item.id){
                      setEditComment(eachComment.content)
                      return {...eachComment,editMode:true}

                    }
                    const updatedReplies = eachComment.replies.map(eachReply=>{
                      if(eachReply.id===item.id){
                        setEditComment(eachReply.content)
                        return {...eachReply,editMode:true}
                      }
                      return {...eachReply,editMode:false}
                    })
                    return {...eachComment,replies:updatedReplies,editMode:false}
                  })
                  setNewData({...newData,comments:updatedComments})
                  
                }}>
                  <Edit className="reply-icon"/>
                  <span>Edit</span>
                </button>
              </div> : 
              <button className='reply-activate-button' onClick={()=>{
                const comments = newData.comments
                  const updatedComments = comments.map(eachComment=>{
                    if(eachComment.id===item.id){
                      return {...eachComment,reply:true}

                    }
                    const updatedReplies = eachComment.replies.map(eachReply=>{
                      if(eachReply.id===item.id){
                        return {...eachReply,reply:true}
                      }
                      return {...eachReply,reply:false}
                    })
                    return {...eachComment,replies:updatedReplies,reply:false}
                  })
                  setNewData({...newData,comments:updatedComments})
                  setComment('')
              }}>
                <Reply className="reply-icon"/>
                <span>Reply</span>
              </button>
              }
            </div>
          </div>
          {
            item.editMode===true ? 
            <div className='update-text-container'>
              <textarea rows='6' className='comment-text-area' value={editcomment}  onChange={(e)=>setEditComment(e.target.value)} autoFocus
              />
              <button className='submit-button update' onClick={()=>{
                const comments = newData.comments
                const updatedComments = comments.map(eachComment=>{
                  if(eachComment.id===item.id){
                    return {...eachComment,content:editcomment,editMode:false}
                  }
                  const updatedReplies = eachComment.replies.map(eachReply=>{
                    if(eachReply.id===item.id){
                      return {...eachReply,content:editcomment,editMode:false}
                    }
                    return eachReply
                  })
                  return {...eachComment,replies:updatedReplies}
                })
                setNewData({...newData,comments:updatedComments})
                localStorage.setItem('data', JSON.stringify({...newData,comments:updatedComments}));
              }}>Update</button>
            </div>
            : 
            <p className='comment-text'>{item.replyingTo && <span className='replying-to-text'>@{item.replyingTo}</span>} {item.content}</p>
          }
        </div>
        
        <div className='comment-interact-container'>
          <div className='score-container'>
            <Plus className='score-icon' onClick={()=>{
              item.score = item.score+1
              let updatedComments = newData.comments.map(eachItem=>{
                if(eachItem.id===item.id){
                  return item
                }
                return eachItem
              })
              let updatedData = {...newData,updatedComments}
              setNewData(updatedData)
              localStorage.setItem('data', JSON.stringify(newData));
            }}/>
            <span className='score'>{item.score}</span>
            <Minus className='score-icon' onClick={()=>{
              item.score = item.score-1
              let updatedComments = newData.comments.map(eachItem=>{
                if(eachItem.id===item.id){
                  return item
                }
                return eachItem
              })
              let updatedData = {...newData,comments:updatedComments}
              setNewData(updatedData)
              localStorage.setItem('data', JSON.stringify(newData));
            }}/>
          </div>
          {
            item.user.username==='juliusomo' ? <div className='user-control-buttons-container'>
            <div>
              <button className='delete-button' onClick={openModal}>
                <Delete className='delete-icon'/>
                <span>Delete</span>
              </button>
              <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                className="modal-delete"
                style={{
                  overlay: {
                    backgroundColor: 'hsla(0, 0%, 43%, 0.555)'
                  },
                  content: {
                    color: 'hsl(211, 10%, 45%)'
                  }
                }}
              >
                <div className='modal-container'>
                  <h2>Delete comment</h2>
                  <p>Are you sure you want to delete this comment? This will remove the comment and can't be undeon</p>
                  <div className='modal-buttons-container'>
                    <button onClick={closeModal} className='delete-button modal-cancel-button'>NO, CANCEL</button>
                    <button className='delete-button modal-delete-button' onClick={()=>{
                      const comments = newData.comments
                      const updatedComments = comments.filter((eachComment)=>{
                        if(eachComment.id!==item.id){
                          return true
                        }
                        return false
                      })
                      const updatedComments1 = comments.map(eachComment=>{
                        const updatedReplies= eachComment.replies.filter(eachReply=>{
                          if(eachReply.id!==item.id){
                            return true
                          }
                          return false
                        })
                        const updatedComment = {...eachComment,replies:updatedReplies}
                        return updatedComment
                      })
            
                      let updatedData = {}
                      if(isReplyComment){
                        updatedData = {...newData,comments:updatedComments1}
                        
                      }
                      else{
                        updatedData = {...newData,comments:updatedComments}
                      }
                      
                      setNewData(updatedData)
                      localStorage.setItem('data', JSON.stringify(updatedData));
                      closeModal()
                    }}>
                      YES, DELETE
                    </button>
                  </div>
                </div>
                
              </Modal>
            </div>

            <button className='reply-activate-button' onClick={()=>{
              const comments = newData.comments
              const updatedComments = comments.map(eachComment=>{
                if(eachComment.id===item.id){
                  setEditComment(eachComment.content)
                  return {...eachComment,editMode:true}

                }
                const updatedReplies = eachComment.replies.map(eachReply=>{
                  if(eachReply.id===item.id){
                    setEditComment(eachReply.content)
                    return {...eachReply,editMode:true}
                  }
                  return {...eachReply,editMode:false}
                })
                return {...eachComment,replies:updatedReplies,editMode:false}
              })
              setNewData({...newData,comments:updatedComments})
              
            }}>
              <Edit className="reply-icon"/>
              <span>Edit</span>
            </button>
          </div> : 
          <button className='reply-activate-button' onClick={()=>{
            const comments = newData.comments
              const updatedComments = comments.map(eachComment=>{
                if(eachComment.id===item.id){
                  return {...eachComment,reply:true}

                }
                const updatedReplies = eachComment.replies.map(eachReply=>{
                  if(eachReply.id===item.id){
                    return {...eachReply,reply:true}
                  }
                  return {...eachReply,reply:false}
                })
                return {...eachComment,replies:updatedReplies,reply:false}
              })
              setNewData({...newData,comments:updatedComments})
              setComment('')
          }}>
            <Reply className="reply-icon"/>
            <span>Reply</span>
          </button>
          }
          
          
        </div>
      </div>
      {
        item.reply && 
        <div className='add-reply-comment-container'>
          {newData.currentUser && <img src={require(`${newData.currentUser.image.png}`)} alt={newData.currentUser.username} className='profile-img profile-img-desktop'/>
          }
        <textarea rows='6' className='comment-text-area' placeholder='Add a comment...' value={comment} onChange={(e)=>setComment(e.target.value)}/>
        <div className='reply-submit-container'>
          {newData.currentUser && <img src={require(`${newData.currentUser.image.png}`)} alt={newData.currentUser.username} className='profile-img'/>
          }
          
          <button className='submit-button' onClick={()=>{
            const timestamp = Date.now()
            const time = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp)
            const newReply = {
              "id": uuid(),
              "content": comment,
              "createdAt": time,
              "score": 1,
              "replyingTo": item.user.username,
              "user": {
                "image": { 
                  "png": "./images/avatars/image-juliusomo.png",
                  "webp": "./images/avatars/image-juliusomo.webp"
                },
                "username": "juliusomo"
              },
              "editMode":false,
              "reply" : false,
            }
            const updatedComments = newData.comments.map(eachItem=>{
              if(eachItem.id===commentId){
                eachItem.replies.push(newReply)
              }
              const updatedReplies = eachItem.replies.map(eachReply=>{
                return {...eachReply,reply:false}
              })
              return {...eachItem,replies:updatedReplies,reply:false}
            })
            setNewData({...newData,comments:updatedComments})
            localStorage.setItem('data', JSON.stringify({...newData,comments:updatedComments}));
          }}>
            Reply
          </button>
        </div>
        <button className='submit-button submit-button-desktop' onClick={()=>{
            const timestamp = Date.now()
            const time = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp)
            const newReply = {
              "id": uuid(),
              "content": comment,
              "createdAt": time,
              "score": 1,
              "replyingTo": item.user.username,
              "user": {
                "image": { 
                  "png": "./images/avatars/image-juliusomo.png",
                  "webp": "./images/avatars/image-juliusomo.webp"
                },
                "username": "juliusomo"
              },
              "editMode":false,
              "reply" : false,
            }
            const updatedComments = newData.comments.map(eachItem=>{
              if(eachItem.id===commentId){
                eachItem.replies.push(newReply)
              }
              const updatedReplies = eachItem.replies.map(eachReply=>{
                return {...eachReply,reply:false}
              })
              return {...eachItem,replies:updatedReplies,reply:false}
            })
            setNewData({...newData,comments:updatedComments})
            localStorage.setItem('data', JSON.stringify({...newData,comments:updatedComments}));
          }}>
            Reply
          </button>
      </div>
      }
      
      </div>
    )
  }
  return (
    <div className="App">
      <ul className='comments-container'>
        {
          newData.comments && newData.comments.map(eachItem=>{
            return(
              <li key={eachItem.id} className='comment-wrapper'>
                {getComment(eachItem,eachItem.id)}
                <div className='replies-container'>
                  {
                    eachItem.replies && eachItem.replies.map(eachReply=><div>{getComment(eachReply,eachItem.id)}</div>)
                  }
                </div>
              </li>
            )
          })
        }
      </ul>
      <div className='add-comment-wrapper'>
        <div className='add-comment-container'>
          <textarea rows='6' className='comment-text-area' placeholder='Add a comment...' value={comment} onChange={(e)=>setComment(e.target.value)}/>
          <div className='submit-container'>
            {newData.currentUser && <img src={require(`${newData.currentUser.image.png}`)} alt={newData.currentUser.username} className='profile-img'/>
            }
            
            <button className='submit-button' onClick={onSubmitComment}>
              Submit
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default App;
