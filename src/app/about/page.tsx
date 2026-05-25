import Link from 'next/link'

const photoUrl = 'https://vfflpjpvbazvzxbuxwme.supabase.co/storage/v1/object/public/website-images/Navigating%20Thriving%20Kids%20and%20Foundational%20Supports%20for%20Early%20Childhood%20Professionals.png'

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fffe'}}>

      {/* Hero */}
      <div style={{backgroundColor: '#e0f7f5'}} className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide mb-3"
               style={{color: '#4ABFB0'}}>
              About Robyn
            </p>
            <h2 className="text-4xl font-bold leading-tight mb-6"
                style={{color: '#1a2e44'}}>
              Movement is the foundation of learning
            </h2>
            <p className="text-lg mb-4" style={{color: '#4a5568'}}>
              I'm Robyn Papworth — Developmental Educator, Exercise Physiologist
              and Certified Trainer. I created Play Move Improve to bring
              specialist support directly into family homes, on your terms
              and in your own time.
            </p>
            <p className="text-lg" style={{color: '#4a5568'}}>
              With years of experience working with children and families,
              I know that the right support at the right time makes all
              the difference — and that support shouldn't have to wait
              for an appointment.
            </p>
          </div>
          <div>
            <img
              src={photoUrl}
              alt="Robyn Papworth speaking at a conference"
              className="rounded-2xl shadow-lg w-full object-cover"
              style={{maxHeight: '480px'}}
            />
          </div>
        </div>
      </div>

      {/* Qualifications */}
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-10 text-center"
              style={{color: '#1a2e44'}}>
            Qualifications and Experience
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Developmental Educator',
                description: 'Specialist training in child development, learning difficulties and developmental delays. Supporting children to reach their full potential.',
              },
              {
                title: 'Exercise Physiologist',
                description: 'University-qualified expertise in how movement and physical activity supports brain development, learning and wellbeing.',
              },
              {
                title: 'Certified Trainer',
                description: 'Skilled in designing and delivering evidence-based programs for children, families and early childhood professionals.',
              },
            ].map(item => (
              <div key={item.title}
                   className="bg-white rounded-2xl shadow-md p-6 border-t-4"
                   style={{borderColor: '#4ABFB0'}}>
                <h4 className="font-bold text-lg mb-3" style={{color: '#1a2e44'}}>
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

      {/* Why I created this */}
      <div style={{backgroundColor: '#e0f7f5'}} className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-8 text-center"
              style={{color: '#1a2e44'}}>
            Why I created Play Move Improve
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                heading: 'For busy families',
                body: 'Life is full. Not every family can make it to regular appointments. These videos are designed to fit into your existing routine — whether that is after school, on weekends, or whenever works for you.',
              },
              {
                heading: 'For homeschooling families',
                body: 'If you are educating at home, you need resources that are practical, evidence-based and easy to follow. Play Move Improve gives you specialist activities you can use any time.',
              },
              {
                heading: 'For families on waiting lists',
                body: 'Waiting lists for specialist support can be long. These videos give your child targeted, meaningful activities while you wait — so no time is wasted.',
              },
              {
                heading: 'For families between appointments',
                body: 'Progress happens between sessions. Use these activities to reinforce what your child is working on and keep the momentum going.',
              },
            ].map(item => (
              <div key={item.heading} className="flex gap-4">
                <div
                  className="w-2 rounded-full flex-shrink-0"
                  style={{backgroundColor: '#4ABFB0'}}
                />
                <div>
                  <h4 className="font-bold mb-2" style={{color: '#1a2e44'}}>
                    {item.heading}
                  </h4>
                  <p className="text-sm" style={{color: '#4a5568'}}>
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who the videos are for */}
      <div className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4" style={{color: '#1a2e44'}}>
            Who are these videos for?
          </h3>
          <p className="text-lg mb-10" style={{color: '#4a5568'}}>
            Play Move Improve videos are designed for children who need
            extra support with their development — particularly in the
            areas of literacy, numeracy and movement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {[
              'Children who are getting ready to read',
              'Children who are learning to read and need extra support',
              'Children who struggle with writing or pencil grip',
              'Children who need help with fine motor skills',
              'Children working on pre-writing fundamentals',
              'Children who need gross motor and coordination support',
            ].map(item => (
              <div key={item}
                   className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <div className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center"
                     style={{backgroundColor: '#e0f7f5'}}>
                  <svg viewBox="0 0 20 20" fill="none"
                       className="w-4 h-4" style={{color: '#4ABFB0'}}>
                    <path d="M5 10l4 4 6-6" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round"
                          strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{color: '#1a2e44'}}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two platforms */}
      <div style={{backgroundColor: '#e0f7f5'}} className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4" style={{color: '#1a2e44'}}>
            Two ways to work with Robyn
          </h3>
          <p className="text-lg mb-10" style={{color: '#4a5568'}}>
            Play Move Improve offers both self-paced video resources
            and live telehealth sessions to suit every family.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-8 border-t-4"
                 style={{borderColor: '#4ABFB0'}}>
              <h4 className="font-bold text-xl mb-3" style={{color: '#1a2e44'}}>
                Video Library
              </h4>
              <p className="text-sm mb-6" style={{color: '#4a5568'}}>
                Pre-recorded literacy, numeracy and gross motor activities
                you can use at home any time. Buy individual videos or
                save with a bundle.
              </p>
              <Link
                href="/shop"
                className="inline-block px-6 py-2 rounded-full font-semibold text-white text-sm"
                style={{backgroundColor: '#4ABFB0'}}
              >
                Browse Videos
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-8 border-t-4"
                 style={{borderColor: '#7B4FA6'}}>
              <h4 className="font-bold text-xl mb-3" style={{color: '#1a2e44'}}>
                The Developmental Hub
              </h4>
              <p className="text-sm mb-6" style={{color: '#4a5568'}}>
                Live telehealth sessions with Robyn and her team of
                specialists. Personalised support for your child's
                individual needs.
              </p>
              <a
                href="https://developmental-hub.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 rounded-full font-semibold text-white text-sm"
                style={{backgroundColor: '#7B4FA6'}}
              >
                Book a Session
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4" style={{color: '#1a2e44'}}>
            Ready to get started?
          </h3>
          <p className="text-lg mb-8" style={{color: '#4a5568'}}>
            Browse the video library and find the right support
            for your child today.
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