import { useState, useEffect, useRef } from "react"
import { useInterval } from "hooks/utils"
import Countdown from 'react-countdown'

export const CountdownTimerDisplay = ({ epoch, type, size = "normal" }: any) => {

  const [ isCounting, setIsCounting ] = useState(true)
  const [ isPreparing, setIsPreparing ] = useState(true)
  const [ currentTime, setCurrentTime ] = useState(0)
  const [ now ,justUpdate ] = useState(new Date().getTime())
  console.log("epoch", epoch * 1000, "currentTime", currentTime)

  const [ timerIntervalTime, setTimerIntervalTime ] = useState(1000)
  const timerIntervalTimeRef = useRef(timerIntervalTime)
  
  const timerInterval = useRef("timer-interval")

  useEffect(() => {
      if (epoch > 0) {
          setIsPreparing(false)
          setCurrentTime(epoch * 1000)
      }

      // console.log((epoch * 1000), now)
      if ((epoch * 1000) > now) {
          setIsCounting(true)
      } else {
          setIsCounting(false)
      }

  }, [epoch])

  
  useInterval(timerInterval, () => {
      // if (isCounting) {
      justUpdate(new Date().getTime())
      // console.log("Tick",  isCounting, currentTime, new Date().getTime())
      // }
  }, timerIntervalTimeRef.current)

  const handleOnComplete = () => {

  }

  const rendererCountdown = ({ days, hours, minutes, seconds, completed }: any) => {
      return (<>
      {/* <div>Time { epoch }</div> */}
      {
          isPreparing
              ? (<>
                  <div>Getting Time</div>
              </>)
              : size === "mini"
              ? (<>
                  <div className="countdown-timer mini">
                  {
                      isCounting ? (<>
                          <div className="_title">
                              {
                                  type === "starting" && (<>
                                      <span>Starting in</span>
                                  </>)
                              } 
                              {
                                  type === "ending" && (<>
                                      <span>Ending in </span>
                                  </>)
                              } 
                          </div>
                          <div className="_clock">
                              <div className="_column">
                                  <div className="value">{days}D</div>
                                  {/* <div className="unit">Days</div> */}
                              </div>
                              <div className="_column">
                                  <div className="value">{hours}h</div>
                                  {/* <div className="unit">Hours</div> */}
                              </div>
                              <div className="_column">
                                  <div className="value">{minutes}m</div>
                                  {/* <div className="unit">Minutes</div> */}
                              </div>
                              <div className="_column">
                                  <div className="value">{seconds}s</div>
                                  {/* <div className="unit">Seconds</div> */}
                              </div>
                          </div>
                      </>) : (<>
                      
                      </>)
                  }
              </div>
              </>): (<div id="countdown-timer" className="countdown-timer">
                  {
                      isCounting ? (<>
                          <div className="_title">
                              {
                                  type === "starting" && (<>
                                      <span>Starting</span>
                                  </>)
                              } 
                              {
                                  type === "ending" && (<>
                                      <span>Ending in </span>
                                  </>)
                              } 
                          </div>
                          <div className="countdown-timer-content">
                              <div className="countdown-timer-column">
                                  <div className="value">{days}</div>
                                  <div className="unit">Days</div>
                              </div>
                              <div className="countdown-timer-column">
                                  <div className="value">{hours}</div>
                                  <div className="unit">Hours</div>
                              </div>
                              <div className="countdown-timer-column">
                                  <div className="value">{minutes}</div>
                                  <div className="unit">Minutes</div>
                              </div>
                              <div className="countdown-timer-column">
                                  <div className="value">{seconds}</div>
                                  <div className="unit">Seconds</div>
                              </div>
                          </div>
                      </>) : (<>
                      
                      </>)
                  }
              </div>)
      }

      </>)
  }

  return (
      <Countdown
          date={new Date(currentTime)}
          renderer={rendererCountdown}
          onComplete={handleOnComplete}
      />
  )
}
