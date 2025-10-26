"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, CheckCircle2, Circle, Trash2 } from "lucide-react"
import type { Task } from "@/lib/types"
import { addTask, updateTask } from "@/lib/db"
import { TaskForm } from "@/components/task-form"

interface TasksProps {
  data: {
    tasks: Task[]
  }
}

export function Tasks({ data }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>(data.tasks)
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "completed">("active")

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask = addTask(taskData)
    setTasks([...tasks, newTask])
    setShowForm(false)
  }

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return
    const updated = updateTask(taskId, { completed: !task.completed })
    if (updated) {
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)))
    }
  }

  const handleSnoozeTask = (taskId: string, days: number) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return
    const newDueDate = new Date()
    newDueDate.setDate(newDueDate.getDate() + days)
    const updated = updateTask(taskId, { dueDate: newDueDate.toISOString().split("T")[0] })
    if (updated) {
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)))
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId))
  }

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === "all") return true
    if (filterStatus === "active") return !t.completed
    return t.completed
  })

  const dueTodayTasks = filteredTasks.filter((t) => {
    if (!t.dueDate) return false
    const today = new Date().toDateString()
    return new Date(t.dueDate).toDateString() === today
  })

  const overdueTasks = filteredTasks.filter((t) => {
    if (t.completed || !t.dueDate) return false
    return new Date(t.dueDate) < new Date()
  })

  const upcomingTasks = filteredTasks.filter((t) => {
    if (t.completed || !t.dueDate) return false
    return new Date(t.dueDate) > new Date()
  })

  const noDueDateTasks = filteredTasks.filter((t) => !t.dueDate && !t.completed)

  const taskTypeColors: Record<string, string> = {
    "follow-up": "bg-blue-500",
    "send-materials": "bg-purple-500",
    "thank-you": "bg-green-500",
    prep: "bg-orange-500",
    other: "bg-gray-500",
  }

  const TaskItem = ({ task }: { task: Task }) => (
    <div className="flex items-start gap-3 p-4 bg-accent rounded-lg hover:shadow-md transition-shadow">
      <button
        onClick={() => handleToggleTask(task.id)}
        className="mt-1 flex-shrink-0 text-muted-foreground hover:text-primary transition-colors"
      >
        {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-1 rounded text-white text-xs font-medium ${taskTypeColors[task.type]}`}>
                {task.type}
              </span>
              {task.priority && (
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-medium ${
                    task.priority === "high"
                      ? "bg-red-500"
                      : task.priority === "medium"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                  }`}
                >
                  {task.priority}
                </span>
              )}
            </div>
            {task.dueDate && (
              <p className="text-xs text-muted-foreground mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(task.id)}>
            <Trash2 size={16} />
          </Button>
        </div>

        {!task.completed && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSnoozeTask(task.id, 1)}
              className="text-xs bg-transparent"
            >
              +1d
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSnoozeTask(task.id, 3)}
              className="text-xs bg-transparent"
            >
              +3d
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSnoozeTask(task.id, 7)}
              className="text-xs bg-transparent"
            >
              +7d
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Tasks & Follow-ups</h1>
          <p className="text-muted-foreground mt-2">Stay on top of your job search activities</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus size={18} />
          Add Task
        </Button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        <Button
          variant={filterStatus === "active" ? "default" : "outline"}
          onClick={() => setFilterStatus("active")}
          className="bg-transparent"
        >
          Active ({tasks.filter((t) => !t.completed).length})
        </Button>
        <Button
          variant={filterStatus === "completed" ? "default" : "outline"}
          onClick={() => setFilterStatus("completed")}
          className="bg-transparent"
        >
          Completed ({tasks.filter((t) => t.completed).length})
        </Button>
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => setFilterStatus("all")}
          className="bg-transparent"
        >
          All ({tasks.length})
        </Button>
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <h2 className="text-xl font-bold text-foreground">Overdue</h2>
            <span className="text-sm bg-accent text-muted-foreground px-3 py-1 rounded-full">
              {overdueTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {overdueTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Due Today */}
      {dueTodayTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <h2 className="text-xl font-bold text-foreground">Due Today</h2>
            <span className="text-sm bg-accent text-muted-foreground px-3 py-1 rounded-full">
              {dueTodayTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {dueTodayTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <h2 className="text-xl font-bold text-foreground">Upcoming</h2>
            <span className="text-sm bg-accent text-muted-foreground px-3 py-1 rounded-full">
              {upcomingTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* No Due Date Tasks */}
      {noDueDateTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <h2 className="text-xl font-bold text-foreground">No Due Date</h2>
            <span className="text-sm bg-accent text-muted-foreground px-3 py-1 rounded-full">
              {noDueDateTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {noDueDateTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {filterStatus !== "active" && tasks.filter((t) => t.completed).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <h2 className="text-xl font-bold text-foreground">Completed</h2>
            <span className="text-sm bg-accent text-muted-foreground px-3 py-1 rounded-full">
              {tasks.filter((t) => t.completed).length}
            </span>
          </div>
          <div className="space-y-3">
            {tasks
              .filter((t) => t.completed)
              .map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
          </div>
        </div>
      )}

      {filteredTasks.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              {filterStatus === "completed" ? "No completed tasks yet" : "No tasks to show"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Create a new follow-up task or reminder</CardDescription>
            </CardHeader>
            <CardContent>
              <TaskForm onSubmit={handleAddTask} onCancel={() => setShowForm(false)} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
