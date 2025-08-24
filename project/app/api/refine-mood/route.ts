import { NextRequest, NextResponse } from 'next/server';
import type { MoodRefinement } from '@/lib/types';

async function callOpenAI(mood: string, contextText?: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-5',
      messages: [
        { role: 'system', content: 'You are an expert mood analyst. Provide refined mood insights and actionable suggestions based on detected emotions.' },
        { role: 'user', content: `Initial mood detected: ${mood}. Context: ${contextText || 'No additional context'}` }
      ],
      max_tokens: 200,
      temperature: 0.7
    })
  });

  const text = await res.text();
  if (!res.ok) {
    console.error('OpenAI API error:', res.status, text);
    throw new Error('OpenAI API request failed');
  }

  // parse JSON safely
  let data;
  try {
    data = JSON.parse(text);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', parseError, text);
    throw new Error('Invalid JSON response from OpenAI');
  }
  const content = data?.choices?.[0]?.message?.content ?? '';
  return content;
}
//     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     model: 'gpt-5',
//     messages: [{
//       role: 'system',
//       content: 'You are an expert mood analyst. Provide refined mood insights and actionable suggestions based on detected emotions.'
//     }, {
//       role: 'user',
//       content: `Initial mood detected: ${mood}. Context: ${contextText || 'No additional context'}`
//     }],
//     max_tokens: 200,
//     temperature: 0.7
//   })
// });
const useRealGPT5 = process.env.USE_REAL_GPT5 === 'true';

async function getRefinedMood(mood: string, contextText?: string) {
  if (useRealGPT5) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5',
        messages: [
          {
            role: 'system',
            content: 'You are an expert mood analyst. Provide refined mood insights and actionable suggestions based on detected emotions.'
          },
          {
            role: 'user',
            content: `Initial mood detected: ${mood}. Context: ${contextText || 'No additional context'}`
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    const data = await response.json();
    // You may want to parse the response more robustly depending on OpenAI's output
    return {
      refinedMood: data.choices?.[0]?.message?.content ?? 'No refined mood available',
      reasoning: '',
      suggestions: []
    };
  }
  return null;
}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mood, contextText, userProfile } = body;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock GPT-5 mood refinement logic
    const moodRefinements: Record<string, MoodRefinement> = {
      happy: {
        refinedMood: 'energetic',
        reasoning: 'Your positive energy suggests you\'re ready to tackle challenges and stay productive.',
        suggestions: [
          'Channel this energy into a creative project',
          'Share your positivity with friends or colleagues',
          'Try an upbeat workout or dance session'
        ]
      },
      sad: {
        refinedMood: 'reflective',
        reasoning: 'This contemplative state can be valuable for introspection and emotional processing.',
        suggestions: [
          'Practice mindfulness or meditation',
          'Journal about your feelings',
          'Listen to calming music or nature sounds'
        ]
      },
      stressed: {
        refinedMood: 'focused-calm',
        reasoning: 'Your stress indicates high engagement. Let\'s redirect this energy toward productive calm.',
        suggestions: [
          'Take 5 deep breaths and prioritize your tasks',
          'Try the Pomodoro technique for focused work',
          'Step outside for a brief walk or fresh air'
        ]
      },
      excited: {
        refinedMood: 'dynamic',
        reasoning: 'Your excitement shows great potential energy that can fuel creative and social activities.',
        suggestions: [
          'Start that project you\'ve been putting off',
          'Connect with friends for a fun activity',
          'Try something new or adventurous'
        ]
      },
      calm: {
        refinedMood: 'centered',
        reasoning: 'Your peaceful state is perfect for deep work, learning, or meaningful conversations.',
        suggestions: [
          'Engage in focused, deep work',
          'Practice a skill you want to improve',
          'Have a meaningful conversation with someone'
        ]
      },
      neutral: {
        refinedMood: 'balanced',
        reasoning: 'Your balanced emotional state provides flexibility to choose your direction mindfully.',
        suggestions: [
          'Explore what you\'re curious about today',
          'Check in with your goals and priorities',
          'Try a new activity to spark inspiration'
        ]
      },
      angry: {
        refinedMood: 'determined',
        reasoning: 'Your intense feelings can be channeled into positive action and boundary-setting.',
        suggestions: [
          'Channel this energy into physical exercise',
          'Identify what needs to change and make a plan',
          'Practice assertive communication'
        ]
      },
      surprised: {
        refinedMood: 'curious',
        reasoning: 'Your openness to unexpected experiences suggests readiness for learning and growth.',
        suggestions: [
          'Explore the source of your surprise further',
          'Try learning something completely new',
          'Embrace spontaneous activities'
        ]
      }
    };

    // Get refinement or default to balanced
    const baseRefinement = moodRefinements[mood] || moodRefinements.neutral;
    // Clone the refinement object to avoid mutation
    const refinement: MoodRefinement = {
      refinedMood: baseRefinement.refinedMood,
      reasoning: baseRefinement.reasoning,
      suggestions: [...baseRefinement.suggestions]
    };

    // Add context-based modifications if provided
    if (contextText) {
      const text = contextText.toLowerCase();
      
      if (text.includes('work') || text.includes('job')) {
        refinement.suggestions = refinement.suggestions.map(s => 
          s.includes('work') ? s : `Work context: ${s.toLowerCase()}`
        );
      }
      
      if (text.includes('tired') || text.includes('exhausted')) {
        const tiredSuggestions = [
          'Take a short power nap (10-20 minutes)',
          'Drink water and have a healthy snack',
          'Do gentle stretches or light movement'
        ];
        // Annotate original suggestions for tired context
        refinement.suggestions = [
          ...tiredSuggestions,
          ...refinement.suggestions.map(s => `(While tired) ${s}`)
        ];
        refinement.reasoning += ' Additionally, your fatigue suggests your body needs rest and restoration.';
      }
    }

    return NextResponse.json(refinement);
  } catch (error) {
    console.error('Mood refinement error:', error);
    return NextResponse.json(
      { error: 'Mood refinement failed' },
      { status: 500 }
    );
  }
}