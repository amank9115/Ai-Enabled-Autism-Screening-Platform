import { useEffect, useMemo, useState } from "react"

const OTP_LENGTH = 6

export const useOtpAuth = () => {
  const [otpValues, setOtpValues] = useState<string[]>(Array(OTP_LENGTH).fill(""))
  const [otpSent, setOtpSent] = useState(false)
  const [timer, setTimer] = useState(0)

  useEffect(() => {
    if (!otpSent || timer <= 0) return
    const id = window.setInterval(() => {
      setTimer((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => clearInterval(id)
  }, [otpSent, timer])

  const otp = useMemo(() => otpValues.join(""), [otpValues])

  const startOtp = () => {
    setOtpSent(true)
    setTimer(30)
    setOtpValues(Array(OTP_LENGTH).fill(""))
  }

  const resetOtp = () => {
    setOtpSent(false)
    setOtpValues(Array(OTP_LENGTH).fill(""))
    setTimer(0)
  }

  return {
    otp,
    otpSent,
    otpValues,
    timer,
    canResend: timer === 0,
    setOtpValues,
    startOtp,
    resetOtp,
  }
}
