import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TargetIcon } from '@radix-ui/react-icons'
import { Button } from '../ui/button'

interface DiceButtonProps {
  sides: number
  onRoll: (result: number) => void
}

function DiceButton({ sides, onRoll }: DiceButtonProps) {
  const handleClick = () => {
    const result = Math.floor(Math.random() * sides) + 1
    onRoll(result)
  }

  return (
    <Button
      onPress={handleClick}
    >
      d{sides}
    </Button>
  )
}

export function DiceWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<number[]>([])

  const toggleWidget = () => setIsOpen(!isOpen)

  const handleRoll = (result: number) => {
    setResults(prev => [...prev, result])
  }

  const clearResults = () => setResults([])

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 0 }}
            animate={{ opacity: 1, scale: 1, y: -10 }}
            exit={{ opacity: 0, scale: 0.8, y: 0 }}
            className="absolute bottom-full right-0 mb-2 bg-popover border p-4 rounded-lg shadow-lg w-64"
          >
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[4, 6, 8, 10, 12, 20].map(sides => (
                <DiceButton key={sides} sides={sides} onRoll={handleRoll} />
              ))}
            </div>
            <div className="text-center">
              <p className="font-bold">Results: {results.join(', ')}</p>
              <p className="font-bold">Total: {results.reduce((a, b) => a + b, 0)}</p>
              <Button
                onPress={clearResults}
                variant={"destructive"}
              >
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        onPress={toggleWidget}
        aria-expanded={isOpen}
        aria-haspopup="true"
        size={"icon"}
      >
        <TargetIcon />
        <span className="sr-only">Toggle dice roller</span>
      </Button>
    </div>
  )
}

