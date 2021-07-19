function BlogEntry ({ children }: any) {
  window.scrollTo(0, 0)
  
  return (<>
    <div className="blog-entry">
      { children }
    </div>
  </>)
}

export { BlogEntry };
export default BlogEntry;
