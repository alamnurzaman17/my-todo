import { cache } from "react";

const fetchPosts = cache(async (page: number) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=10`,
    { next: { revalidate: 10 } }
  );
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
});

export default async function PostsServerComponent() {
  const initialPosts = await fetchPosts(1);

  return (
    <div id="initial-posts" data-posts={JSON.stringify(initialPosts)}></div>
  );
}
