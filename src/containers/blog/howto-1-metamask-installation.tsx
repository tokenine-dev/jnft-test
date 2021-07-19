import { Link } from 'react-router-dom'
import BlogEntry from './blog-entry'
import img1 from "assets/img/blog/howto/metamask-setup_image_1.jpg"

function MetaMaskSetup () {

  return (<>
    <BlogEntry>
      <div className="blog-post">
        <h1>การเริ่มใช้งาน JNFT ( TestNet ) - 1. วิธีการตั้งค่ากระเป๋า MetaMask</h1>
        <div className="fullvideo">
          <div className="_title">
            1. Install MetaMask extension on Google Chrome
          </div>
          <iframe
            src="https://www.youtube.com/embed/AR6-4YucKkw"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p>
          1. เลือกใช้บราวเซอร์ Chrome เพื่อติดตั้ง MetaMask สามารถเข้าไปได้ที่ลิงค์ <br />
          <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank" rel="noreferrer">MetaMask on Chrome Web Store</a>
          <img src={img1} />
        </p>
        
        <div className="_steps">
          <div className="_next">
            <Link to={`/blog/howto-2-bsc-testnet-setup`}>Add BSC Testnet network to MetaMask</Link>
          </div>
        </div>
      </div>
    </BlogEntry>
  </>)
}

export { MetaMaskSetup }
export default MetaMaskSetup
