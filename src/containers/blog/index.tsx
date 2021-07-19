import { Link } from 'react-router-dom'
import MetaMaskThumb from 'assets/img/blog/howto/metamask-wallet.jpg'
import BSCThumb from 'assets/img/blog/howto/binance-smart-chain.jpg'
import BNBThumb from 'assets/img/blog/howto/bnb.jpg'
import JFINThumb from 'assets/img/blog/howto/jfin.jpg'

const blogs = [
  {
    title: "การเริ่มใช้งาน JNFT (TestNet) - 1. ติดตั้งกระเป๋า MetaMask",
    description: "...",
    uri: "howto-1-metamask-installation",
    thumbnail: MetaMaskThumb
  },
  {
    title: "การเริ่มใช้งาน JNFT (TestNet) - 2. วิธีการตั้งค่า Binance Smart Chain (BSC)",
    description: "...",
    uri: "howto-2-bsc-testnet-setup",
    thumbnail: BSCThumb
  },
  {
    title: "การเริ่มใช้งาน JNFT (TestNet) - 3. วิธีรับ BNB ฟรี เพื่อใช้เป็นค่าแก๊สบน Testnet",
    description: "...",
    uri: "howto-3-get-free-bnb",
    thumbnail: BNBThumb
  },
  {
    title: "การเริ่มใช้งาน JNFT (TestNet) - 4. วิธีรับ Fake JFIN ฟรี เพื่อใช้ทดลองซื้อ/ประมูลงานอาร์ตบน JNFT",
    description: "...",
    uri: "howto-4-get-free-jfin",
    thumbnail: JFINThumb
  }
]


function Blog () {
  // const blogs = Array.from([1,2,3,4,5,6,7,8,9,10])


  return (<>
    <div className="blog-explorer">
      <div className="_title">JNFT Blog</div>
      <div className="blog-post-entries">
        { blogs.map((entry: any) => <BlogPostEntry data={entry} />) }
      </div>
    </div>
  </>)
}

export { Blog }
export default Blog

function BlogPostEntry ({ data }: any) {
  const { title, description, uri, thumbnail } = data

  return (<>
    <Link to={`/blog/${uri}`}>
      <div className="blog-post-entry">
        <div className="_thumb-image" style={{ backgroundImage: `url(${thumbnail})`}}>
        </div>
        <div className="_info">
          <div className="_title">{ title }</div>
          <div className="_description">{ description }</div>
        </div>
      </div>
    </Link>
  </>)
}
