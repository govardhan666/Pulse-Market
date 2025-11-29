'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCreateMarket } from '@/hooks/useContract';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

export default function CreateMarketPage() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('7'); // days
  const { createMarket, isPending, isConfirming, isSuccess } = useCreateMarket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    try {
      const durationSeconds = parseInt(duration) * 24 * 60 * 60;
      await createMarket(question, description, durationSeconds);
      toast.success('Market created successfully!');
      setTimeout(() => router.push('/'), 2000);
    } catch (error) {
      toast.error('Failed to create market');
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Create Prediction Market
        </h1>
        <p className="text-lg text-gray-600">
          Create a new prediction market for the community to trade on.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Market Details</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Question *
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Will Bitcoin reach $100,000 by the end of 2025?"
                required
                maxLength={200}
              />
              <p className="mt-1 text-sm text-gray-500">
                {question.length}/200 characters
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Provide additional context and resolution criteria..."
                rows={4}
                maxLength={500}
              />
              <p className="mt-1 text-sm text-gray-500">
                {description.length}/500 characters
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Market Duration (days) *
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="1">1 day</option>
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Market will close after this duration
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 className="font-medium text-primary-900 mb-2">Important Notes</h4>
              <ul className="text-sm text-primary-800 space-y-1 list-disc list-inside">
                <li>You will be responsible for resolving this market</li>
                <li>Markets use a 2% platform fee on trades</li>
                <li>All trades happen in real-time using Somnia Data Streams</li>
                <li>Make sure your question is clear and unambiguous</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                isLoading={isPending || isConfirming}
              >
                <PlusCircle className="h-5 w-5" />
                {isPending || isConfirming ? 'Creating...' : 'Create Market'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
