import { useRef } from "react"

type OtpInputProps = {
  values: string[]
  onChange: (values: string[]) => void
}

const OTP_LENGTH = 6

const OtpInput = ({ values, onChange }: OtpInputProps) => {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1)
    const next = [...values]
    next[index] = digit
    onChange(next)
    if (digit && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !values[index] && index > 0) refs.current[index - 1]?.focus()
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH)
    if (!pasted) return
    event.preventDefault()
    const next = Array(OTP_LENGTH).fill("")
    pasted.split("").forEach((char, idx) => {
      next[idx] = char
    })
    onChange(next)
    refs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus()
  }

  return (
    <div className="flex gap-2">
      {values.map((value, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node
          }}
          value={value}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          maxLength={1}
          inputMode="numeric"
          className="h-11 w-10 rounded-lg border border-slate-300 bg-white/80 text-center text-lg font-semibold text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-300/50 dark:border-slate-600 dark:bg-slate-900/65 dark:text-slate-100"
        />
      ))}
    </div>
  )
}

export default OtpInput
