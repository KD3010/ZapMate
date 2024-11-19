import clsx from 'clsx'
import React from 'react'

const Spinner = ({color, size}: {
  color: string
  size: number
}) => {
  return (
    <div className={clsx(`animate-spin inline-block size-${size} border-[5px] border-current border-t-transparent  rounded-full`, {
      "text-primary-500 dark:text-primary-500": color === "primary",
      "text-white dark:text-white": color === "white"
    })} role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
    </div>
  )
}

export default Spinner