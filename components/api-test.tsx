"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { checkApiHealth, testApiConnection } from "@/lib/apiHealth"

export default function ApiTest() {
  const [healthStatus, setHealthStatus] = useState<string>("")
  const [categoriesStatus, setCategoriesStatus] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testHealth = async () => {
    setLoading(true)
    try {
      await checkApiHealth()
      setHealthStatus("✅ API Health OK")
    } catch (error) {
      setHealthStatus("❌ API Health Failed")
    } finally {
      setLoading(false)
    }
  }

  const testCategories = async () => {
    setLoading(true)
    try {
      await testApiConnection()
      setCategoriesStatus("✅ Categories API OK")
    } catch (error) {
      setCategoriesStatus("❌ Categories API Failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">API Test</h3>
      <div className="space-y-4">
        <div>
          <Button onClick={testHealth} disabled={loading}>
            Test Health
          </Button>
          <span className="ml-2">{healthStatus}</span>
        </div>
        <div>
          <Button onClick={testCategories} disabled={loading}>
            Test Categories
          </Button>
          <span className="ml-2">{categoriesStatus}</span>
        </div>
      </div>
    </div>
  )
} 