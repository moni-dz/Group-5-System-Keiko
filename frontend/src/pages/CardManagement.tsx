import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Trash2 } from "lucide-react"
import { FlashcardProps } from "@/components/Flashcard.tsx";

type FlashcardItem = FlashcardProps;

// Dummy API functions
const api = {
    getItems: (): Promise<FlashcardItem[]> =>
        new Promise(resolve => setTimeout(() => resolve([
            { id: "1", question: "What is React?", answer: "A JavaScript library for building user interfaces", difficulty: "Easy", tag: "React" },
            { id: "2", question: "What is JSX?", answer: "A syntax extension for JavaScript", difficulty: "Medium", tag: "React" }
        ]), 500)),

    addItem: (item: Omit<FlashcardItem, 'id'>): Promise<FlashcardItem> =>
        new Promise(resolve => setTimeout(() => resolve({ ...item, id: Date.now() }), 500)),

    updateItem: (item: FlashcardItem): Promise<FlashcardItem> =>
        new Promise(resolve => setTimeout(() => resolve(item), 500)),

    deleteItem: (id: number): Promise<void> =>
        new Promise(resolve => setTimeout(resolve, 500))
}

export default function Component() {
    const [items, setItems] = useState<FlashcardItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        difficulty: '',
        tag: ''
    })

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            setLoading(true)
            const data = await api.getItems()
            setItems(data)
        } catch (err) {
            setError('Failed to fetch items')
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            if (editingId) {
                const updatedItem = await api.updateItem({ id: editingId, ...formData })
                setItems(items.map(item => item.id === editingId ? updatedItem : item))
                setEditingId(null)
            } else {
                const newItem = await api.addItem(formData)
                setItems([...items, newItem])
            }
            setFormData({ question: '', answer: '', difficulty: '', tag: '' })
        } catch (err) {
            setError('Failed to save item')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (item: FlashcardItem) => {
        setEditingId(item.id)
        setFormData(item)
    }

    const handleDelete = async (id: number) => {
        try {
            setLoading(true)
            await api.deleteItem(id)
            setItems(items.filter(item => item.id !== id))
        } catch (err) {
            setError('Failed to delete item')
        } finally {
            setLoading(false)
        }
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Quiz CRUD</h1>
            <form onSubmit={handleSubmit} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="question">Question</Label>
                        <Input
                            id="question"
                            name="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="answer">Answer</Label>
                        <Input
                            id="answer"
                            name="answer"
                            value={formData.answer}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Input
                            id="difficulty"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="tag">Tag</Label>
                        <Input
                            id="tag"
                            name="tag"
                            value={formData.tag}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <Button type="submit" className="mt-4" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingId ? 'Update' : 'Add'} Item
                </Button>
            </form>

            {loading && !items.length ? (
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <Card key={item.id}>
                            <CardHeader>
                                <CardTitle>{item.question}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Answer:</strong> {item.answer}</p>
                                <p><strong>Difficulty:</strong> {item.difficulty}</p>
                                <p><strong>Tag:</strong> {item.tag}</p>
                                <div className="flex justify-end mt-4">
                                    <Button variant="outline" className="mr-2" onClick={() => handleEdit(item)}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}