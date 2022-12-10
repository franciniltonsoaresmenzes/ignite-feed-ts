import { format, formatDistanceToNow } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { ChangeEvent, FormEvent, InvalidEvent, useState } from "react"

import { Avatar } from "./Avatar"
import { Comment } from "./Comment"

import styles from "./Post.module.css"

interface Author {
  name: string;
  rule: string;
  avatarUrl: string;
}

interface Content {
  type: 'paragraph' | 'link'
  content: string
}

export interface PostProps {
  author: Author;
  content: Content[];
  publishedAt: Date;
}

export function Post({ author, publishedAt, content }: PostProps) {
   const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  })
  
  // const publishedDateFormatted = new Intl.DateTimeFormat('pt-BR', {
  //   day: '2-digit',
  //   month: 'long',
  //   hour: '2-digit',
  //   minute: '2-digit',
  // }).format(publishedAt)

  const publishedDateRelativeNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true
  })

  const [comments, setComments] = useState([
    'Post muito bacana hein!'
  ])

  const [newCommentText, setNewCommentText] = useState('')

  function handleCreateNewCommet(event: FormEvent) {
    event.preventDefault()

    setComments([...comments, newCommentText])
    setNewCommentText('')
  }

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('')
    setNewCommentText(event.target.value)
  }

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event.target.setCustomValidity('Esse campo é obrigatorio')
  }

  function deleteComment(commentToDelete: string) {
    const commentWithoutDeleteOne = comments.filter(comment => comment !== commentToDelete)

    setComments(commentWithoutDeleteOne)
  }
  
  const isNewCommentEmpty = newCommentText.length === 0

  return (
    <article className={styles.post} >
      <header>
        <div className={styles.author} >
          <Avatar
            src={author.avatarUrl}
          />

          <div className={styles.authorInfo} >
            <strong>{author.name}</strong>
            <span>{author.rule}</span>
          </div>
        </div>

        <time title={publishedDateFormatted} dateTime={publishedAt.toISOString()}>
          {publishedDateRelativeNow}
        </time>
      </header>

      <div className={styles.content} >
        {content.map(line => {
          if (line.type === 'paragraph') {
            return <p  key={line.content}>{line.content}</p>
          }else if (line.type === 'link') {
            return <p key={line.content} ><a href="#" >{line.content}</a></p>
          }
        })}
      </div>

      <form onSubmit={handleCreateNewCommet} className={styles.commentForm} >
        <strong>Deixe seu feedback</strong>
        <textarea 
          name="comment"
          placeholder="Deixe um comentário"
          value={newCommentText}
          onChange={handleNewCommentChange}
          onInvalid={handleNewCommentInvalid}
          required
        />
        <footer>
          <button 
            type="submit"
            disabled={isNewCommentEmpty}
          >
            Publicar
          </button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map(comment => (
          <Comment 
            key={comment} 
            content={comment} 
            onDeleteComment={deleteComment} 
          />
        ))}
      </div>
    </article>
  )
}
