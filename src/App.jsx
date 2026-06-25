import { useEffect, useMemo, useState } from 'react'
import './App.css'

const notificationApiUrl = 'http://4.224.186.213/evaluation-service/notifications'

const filterOptions = ['All', 'Placement', 'Result', 'Event']
const priorityRank = {
  Placement: 3,
  Result: 2,
  Event: 1,
}

function normalizeNotification(notification) {
  return {
    id: notification.ID,
    type: notification.Type || 'Event',
    message: notification.Message || 'New notification arrived',
    timestamp: notification.Timestamp || '',
  }
}

function scoreNotification(notification) {
  const priority = priorityRank[notification.type] ?? 0
  const receivedAt = Number.isNaN(Date.parse(notification.timestamp))
    ? 0
    : new Date(notification.timestamp).getTime()

  return priority * 1_000_000_000_000 + receivedAt
}

function formatTimestamp(timestamp) {
  const parsed = new Date(timestamp)

  if (Number.isNaN(parsed.getTime())) {
    return 'Time not available'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed)
}

function App() {
  const [filter, setFilter] = useState('All')
  const [topCount, setTopCount] = useState(5)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadNotifications() {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(notificationApiUrl, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const fetchedNotifications = Array.isArray(payload.notifications)
          ? payload.notifications.map(normalizeNotification)
          : []

        setNotifications(fetchedNotifications)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Unable to load notifications')
        }
      } finally {
        setLoading(false)
      }
    }

    loadNotifications()

    return () => controller.abort()
  }, [])

  const visibleItems = useMemo(() => {
    return notifications
      .filter((notification) => filter === 'All' || notification.type === filter)
      .sort((left, right) => scoreNotification(right) - scoreNotification(left))
      .slice(0, topCount)
  }, [filter, notifications, topCount])

  const totalNotifications = notifications.length
  const placementCount = notifications.filter(
    (notification) => notification.type === 'Placement',
  ).length
  const resultCount = notifications.filter(
    (notification) => notification.type === 'Result',
  ).length
  const eventCount = notifications.filter(
    (notification) => notification.type === 'Event',
  ).length

  const latestNotification = notifications[0]

  return (
    <main className="dashboard-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Campus Notifications Microservice</p>
          <h1>Priority notifications pulled straight from the API.</h1>
          <p className="hero-text">
            The inbox stays lean by ranking placement notices above results and
            results above events, then trimming the view to the top items the
            user asked for.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-button">
              Showing top {topCount}
            </button>
            <button type="button" className="ghost-button">
              {totalNotifications} notifications loaded
            </button>
          </div>
        </div>

        <aside className="hero-card">
          <span className="hero-card-label">Latest item</span>
          <strong>{latestNotification ? latestNotification.type : 'Waiting for data'}</strong>
          <p>
            {latestNotification
              ? latestNotification.message
              : 'Notifications will appear here once the API responds.'}
          </p>
          <dl>
            <div>
              <dt>Placements</dt>
              <dd>{placementCount}</dd>
            </div>
            <div>
              <dt>Results</dt>
              <dd>{resultCount}</dd>
            </div>
            <div>
              <dt>Events</dt>
              <dd>{eventCount}</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="controls-panel">
        <div>
          <p className="section-label">Filter</p>
          <div className="filter-pills" role="tablist" aria-label="Notification filter">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={option === filter ? 'pill pill-active' : 'pill'}
                onClick={() => setFilter(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="section-label">Top count</p>
          <div className="count-selector">
            {[10, 15, 20].map((count) => (
              <button
                key={count}
                type="button"
                className={count === topCount ? 'count-button count-active' : 'count-button'}
                onClick={() => setTopCount(count)}
              >
                {count}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="inbox-panel">
        <div className="panel-heading">
          <div>
            <p className="section-label">Priority inbox</p>
            <h2>{visibleItems.length} notifications ready for review</h2>
          </div>
          <span className="panel-badge">Live API data</span>
        </div>

        {loading && <div className="empty-state">Loading notifications...</div>}

        {!loading && error && <div className="empty-state">{error}</div>}

        {!loading && !error && visibleItems.length > 0 && (
          <div className="notification-list">
            {visibleItems.map((item) => (
              <article key={item.id} className="notification-card">
                <div className="notification-header">
                  <div>
                    <span className="type-chip">{item.type}</span>
                    <h3>{item.message}</h3>
                  </div>
                  <span className="received-time">{formatTimestamp(item.timestamp)}</span>
                </div>

                <div className="notification-footer">
                  <span>{item.id}</span>
                  <span>{item.type === 'Placement' ? 'highest' : item.type === 'Result' ? 'middle' : 'steady'}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && visibleItems.length === 0 && (
          <div className="empty-state">
            <strong>No notifications match this filter.</strong>
            <p>Try another category or increase the top count.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default App
