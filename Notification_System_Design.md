# Stage 1

## Priority Inbox Design

### Priority Logic
To determine the priority of a notification, we evaluate two main factors:
1. **Weight**: Notifications are categorized by type, where `Placement` has the highest priority, followed by `Result`, and finally `Event`. (Placement > Result > Event).
2. **Recency**: If two notifications have the same weight, the one that arrived more recently (newer timestamp) is given higher priority.

### Maintaining Top 10 Efficiently
As new notifications continuously arrive in a real-time system, sorting the entire list of notifications every time is inefficient, taking O(N log N) time where N is the total number of unread notifications.

To maintain the top 10 efficiently, we can use a **Min-Heap (Priority Queue)** of size `k` (where `k = 10`):

1. **Initialization**: We keep a Min-Heap that stores the top 10 notifications seen so far. The element at the root of the Min-Heap is the notification with the *lowest* priority among the current top 10.
2. **Processing New Notifications**: When a new notification arrives:
   - If the heap has fewer than 10 elements, we simply insert the new notification into the heap. This takes O(log k) time.
   - If the heap already has 10 elements, we compare the new notification with the root of the heap (the 10th highest priority notification).
     - If the new notification has a *lower or equal* priority, we ignore it.
     - If the new notification has a *higher* priority than the root, we remove the root and insert the new notification. This takes O(log k) time.
3. **Retrieval**: When the user wants to view the priority inbox, we can just extract the 10 elements from the heap and sort them descending by priority to display.

**Time Complexity**: 
- Inserting a new notification: O(log k)
- Since `k = 10` is a constant, the insertion time is effectively **O(1)**.
This approach scales perfectly regardless of how many millions of notifications are received.

**Space Complexity**: O(k), which is O(1) for storing just 10 elements in memory.
