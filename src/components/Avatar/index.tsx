import { useState, useRef } from "react"
import { useInterval } from 'hooks/utils'

import AVATAR_PLACEHOLDER_IMAGE_1 from "assets/img/avatar_placeholder_1.jpg"
import AVATAR_PLACEHOLDER_IMAGE_2 from "assets/img/avatar_placeholder_2.jpg"
import AVATAR_PLACEHOLDER_IMAGE_3 from "assets/img/avatar_placeholder_3.jpg"
import AVATAR_PLACEHOLDER_IMAGE_4 from "assets/img/avatar_placeholder_4.jpg"
import AVATAR_PLACEHOLDER_IMAGE_5 from "assets/img/avatar_placeholder_5.jpg"
import AVATAR_PLACEHOLDER_IMAGE_6 from "assets/img/avatar_placeholder_6.jpg"

const placeholder_images = [
  AVATAR_PLACEHOLDER_IMAGE_1,
  AVATAR_PLACEHOLDER_IMAGE_2,
  AVATAR_PLACEHOLDER_IMAGE_3,
  AVATAR_PLACEHOLDER_IMAGE_4,
  AVATAR_PLACEHOLDER_IMAGE_5,
  AVATAR_PLACEHOLDER_IMAGE_6,
]

function Avatar ({ data = ({}) as any, handler = ({}) as any}: any) {
  const { user, size = 32 } = data
  const [ _size, setSize ] = useState(size)
  const [ placeholderIndex, setPlaceholderIndex ] = useState(0)
  const _inverval = useRef("placeholder-interval")

  useInterval(_inverval, () => {
    let _target = placeholderIndex < placeholder_images.length - 1 ? placeholderIndex + 1 : 0
    setPlaceholderIndex(_target)
  }, 3000)
  

  return (<>
    <div className="avatar-display" style={{ width: size + "px", height: size + "px"}}>
        { user?.images
            ? (<div className={`_placeholder`} style={{ backgroundImage: `url(${user?.images?.thumbnail_128})`, backgroundSize: `${size}px` }} />)
            : (<div className={`_placeholder`} style={{ backgroundImage: `url(${placeholder_images[placeholderIndex]})`, backgroundSize: `${size}px` }} />)
        }
    </div>
  </>)
}

export default Avatar
