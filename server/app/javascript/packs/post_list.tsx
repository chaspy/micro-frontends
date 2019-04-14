import React, { userState, useEffect } from 'react'
import ReactDOM from 'react-dom'

type PostJson = {
  id: number,
  title: string,
  body: string,
}

type PostProps = {
  id: number,
  title: string,
  body: string,
}

type Post = {
  id: number;
  title: string;
  body: string;

  constructor({id, title, body}: PostProps) {
    this.id = id;
    this.title = title;
    this.body = body;
  }

  public static fromJSON(object: PostJson) {
    const { id, title, body } = object;
    return new Post({ id, title, body });
  }
}

const PostList = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/posts.json')
      .then(res => res.json())
      .then(jsonArr => jsonArr.map((json: PostJson) =>
        Post.fromJSON(json))
      )
      .then(posts => setPosts(posts))
  }, []);

  const handleDestroyPost = (postId: number) => {
    const tokenElement =
      document.querySelector('meta[name="csrf-token"]');
    console.log('/posts/${postid}',postId)
    fetch('/posts/${postId}.json', {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': tokenElement &&
          tokenElement.getAttribute('content')
      }
    })
    .then(() => {
      const postIndex = posts.findIndex(post => post,id === postId);
      setPosts([
        ...posts.slice(0, postIndex),
        ...posts.slice(postIndex + 1)
      ])
    })
  }

  return (
    <React.Fragment>
      <h1>Posts</h1>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Body</th>
            <th colSpan={3}></th>
          </tr>
        </thead>

        <tbody>
          {
            posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.body}</td>
                <td><a href={'/posts/${post.id}'}>Show</a></td>
                <td><a href={'/posts/${post.id}/edit'}>Edit</a></td>
                <td><button onClick={
                  () => handleDestroyPost(post.id)
                }>Destroy</button></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </React.Fragment>
  );
}

export default PostList;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <PostList />,
    document.body.appendChild(document.createElement('div')),
  )
})
