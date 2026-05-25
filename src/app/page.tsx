import Link from 'next/link'
import Image from 'next/image'

const activities = [
  {
    image: 'https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/cup-stacking-tummy-time-activity.png',
    title: 'Movement & Coordination',
    description: 'Build core strength and body awareness through playful movement activities.',
  },
  {
    image: 'https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/drumming-counting-activity.png',
    title: 'Rhythm & Counting',
    description: 'Develop number sense and listening skills through music and rhythm.',
  },
  {
    image: 'https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/fine-motor-pinching-sorting-activity.png',
    title: 'Fine Motor Skills',
    description: 'Strengthen little fingers and hands ready for writing and self-care.',
  },
  {
    image: 'https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/flashlight-shapes-activity.png',
    title: 'Early Literacy',
    description: 'Introduce letters, shapes and sounds through hands-on exploration.',
  },
  {
    image: 'https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/letter-sounds-play-activity.png',
    title: 'Letter Sounds',
    description: 'Connect letters to sounds and words through play-based learning.',
  },
  {
    image: 'https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/sensory-tracing-activity-2.png',
    title: 'Sensory Learning',
    description: 'Use touch and sensation to reinforce pre-writing and letter formation.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fffe'}}>

      {/* Hero */}
      <div style={{backgroundColor: '#e0f7f5'}} className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-5xl font-bold leading-tight mb-4"
                style={{color: '#1a2e44'}}>
              Expert activities to help your child thrive
            </h2>
            <p className="text-lg mb-4" style={{color: '#4a5568'}}>
              Play Move Improve provides specialist-designed video activities
              for families. No waiting rooms, no appointments — just clear,
              practical support you can use at home today.
            </p>
            <p className="text-lg mb-8" style={{color: '#4a5568'}}>
              Each activity comes with a printable resource and is designed
              by a qualified child development specialist.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/shop"
                className="px-6 py-3 rounded-full font-semibold text-white shadow-md"
                style={{backgroundColor: '#4ABFB0'}}
              >
                Browse Activities
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-full font-semibold border-2"
                style={{borderColor: '#4ABFB0', color: '#4ABFB0'}}
              >
                Sign In
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/cup-stacking-tummy-time-activity.png"
              alt="Cup stacking activity"
              className="rounded-2xl w-full h-48 object-cover shadow-md"
            />
            <img
              src="https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/drumming-counting-activity.png"
              alt="Drumming activity"
              className="rounded-2xl w-full h-48 object-cover shadow-md mt-6"
            />
            <img
              src="https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/fine-motor-pinching-sorting-activity.png"
              alt="Fine motor activity"
              className="rounded-2xl w-full h-48 object-cover shadow-md"
            />
            <img
              src="https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/flashlight-shapes-activity.png"
              alt="Flashlight shapes activity"
              className="rounded-2xl w-full h-48 object-cover shadow-md mt-6"
            />
          </div>
        </div>
      </div>

      {/* Trust bar */}
      <div className="py-8 px-6 border-b" style={{borderColor: '#e0f7f5'}}>
        <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {[
            { stat: 'Expert-designed', label: 'by a qualified specialist' },
            { stat: 'Printables included', label: 'with every activity' },
            { stat: 'Watch anytime', label: 'at your own pace' },
            { stat: 'No subscription', label: 'pay only for what you need' },
          ].map(item => (
            <div key={item.stat} className="flex flex-col items-center">
              <span className="text-lg font-bold" style={{color: '#4ABFB0'}}>
                {item.stat}
              </span>
              <span className="text-sm" style={{color: '#4a5568'}}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* What we help with */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-3 text-center" style={{color: '#1a2e44'}}>
            Activities for every stage of development
          </h3>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{color: '#4a5568'}}>
            Whether your child needs support with reading, writing, coordination
            or big feelings — we have targeted activities to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map(activity => (
              <div key={activity.title}
                   className="bg-white rounded-2xl shadow-md overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <h4 className="font-bold text-lg mb-1" style={{color: '#1a2e44'}}>
                    {activity.title}
                  </h4>
                  <p className="text-sm" style={{color: '#4a5568'}}>
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="px-8 py-3 rounded-full font-semibold text-white shadow-md inline-block"
              style={{backgroundColor: '#4ABFB0'}}
            >
              See All Activities
            </Link>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{backgroundColor: '#e0f7f5'}} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center" style={{color: '#1a2e44'}}>
            How it works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Find what your child needs',
                description: 'Browse by developmental area — reading, writing, coordination, emotions and more.',
              },
              {
                step: '2',
                title: 'Buy individual videos or a bundle',
                description: 'Purchase just one video for A$5 or save with a full bundle of 10 videos for A$39.',
              },
              {
                step: '3',
                title: 'Watch and download at home',
                description: 'Access your videos and printable resources any time from your personal library.',
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg"
                  style={{backgroundColor: '#4ABFB0'}}
                >
                  {item.step}
                </div>
                <h4 className="font-bold text-lg mb-2" style={{color: '#1a2e44'}}>
                  {item.title}
                </h4>
                <p className="text-sm" style={{color: '#4a5568'}}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4" style={{color: '#1a2e44'}}>
            Ready to support your child?
          </h3>
          <p className="text-lg mb-8" style={{color: '#4a5568'}}>
            Join families across Australia and around the world using
            Play Move Improve activities at home.
          </p>
          <Link
            href="/shop"
            className="px-8 py-4 rounded-full font-semibold text-white shadow-md inline-block text-lg"
            style={{backgroundColor: '#4ABFB0'}}
          >
            Browse Activities
          </Link>
        </div>
      </div>

    </div>
  )
}