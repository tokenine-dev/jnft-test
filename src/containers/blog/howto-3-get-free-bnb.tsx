import { Link } from 'react-router-dom'
import BlogEntry from "./blog-entry"

import img2 from "assets/img/blog/howto/metamask-setup_image_2.jpg"
import img3 from "assets/img/blog/howto/metamask-setup_image_3.jpg"
import img4 from "assets/img/blog/howto/metamask-setup_image_4.jpg"
import img5 from "assets/img/blog/howto/metamask-setup_image_5.jpg"
import img6 from "assets/img/blog/howto/metamask-setup_image_6.jpg"
import img7 from "assets/img/blog/howto/metamask-setup_image_7.jpg"

function GetFreeBNB () {
  return (<>
    <BlogEntry>
      <div className="blog-post">
        <h1>Preparation before using JNFT platform</h1>
        <div className="fullvideo">
          <div className="_title">
            Get free BNB
          </div>
          <iframe
            src="https://www.youtube.com/embed/lSj44Oyw-gs"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <p>
          <span>        
            2. เมื่อทำการสมัคร Metamask เรียบร้อยแล้ว ต่อไปคุณต้องทำการตั้งค่ากระเป๋าก่อนการใช้งาน JNFT ให้คุณเข้าไปที่ Metamask จากนั้นคลิกเข้าไปที่รูปโปรไฟล์ของคุณ
          </span>
          <img src={img2} />
          <span>
            คลิกเมนู Settings
          </span>
          <img src={img3} />
          <span>
            เลือก Network กด add network และเลือก Custom RPC
          </span>
          <img src={img4} />
        </p>
        <p>
          <span>
            3. หลังจากนั้นให้คุณทำการใส่ข้อมูลดังนี้<br />
            Network name: BSC Testnet <br />
            New RPC URL: https://data-seed-prebsc-2-s3.binance.org:8545/<br />
            Chain ID: 97<br />
            Currency Symbol: BNB<br />
            Block Explorer URL: bscscan.com<br />
          </span>
          <img src={img5} />
        </p>
        <p>
          <span>
            4. หลังจากนั้นให้คุณกด Save จะมี Network ของ BSC Testnet เพิ่มขึ้นมาใน Network ของคุณ จากนั้นกดเลือก Network BSC Testnet
          </span>
          <img src={img6} />
        </p>
        <p>
          <span>
            5. เมื่อคุณตั้งค่ากระเป๋า Metamask เรียบร้อยแล้ว ให้คุณเข้าไปที่เว็บไซต์ demo.jnft.digital  คุณจะเห็นหน้าเว็บไซต์ JNFT มุมด้านขวาบนจะขึ้นคำว่า Connect Wallet แสดงว่าการเชื่อมต่อของคุณเสร็จสมบูรณ์
          </span>
          <img src={img7} />
        </p>

        <div className="_steps">
          <div className="_prev">
            <Link to={`/blog/howto-2-bsc-testnet-setup`}>Add BSC Testnet network to MetaMask</Link>
          </div>
          <div className="_next">
            <Link to={`/blog/howto-4-get-free-jfin`}>Get free JFIN</Link>
          </div>
        </div>
      </div>
    </BlogEntry>
  </>)
}

export { GetFreeBNB }
export default GetFreeBNB
