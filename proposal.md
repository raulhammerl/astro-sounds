# Proposal: Multi-Track Posts

This document outlines a proposal for modifying the Astro-Sounds application to support posts with multiple tracks, where each track has its own set of emoji reactions.

## 1. Goal

The primary goal is to evolve the application from a "one track per post" model to a "many tracks per post" model. This will allow users to create curated posts that group several tracks together, for example, as part of a playlist or a themed collection.

## 2. Proposed Solution

The proposed solution is to store an array of tracks directly within the `posts` table using a `JSONB` column. This approach is less disruptive than creating a new `tracks` table and keeps the changes more contained.

### 2.1. Database Schema Changes

The following changes are required for the Supabase database schema.

**1. Add a `tracks` column to the `posts` table:**

This column will store an array of track objects.

```sql
ALTER TABLE posts
ADD COLUMN tracks JSONB;
```

Each post will now have a `title` for the post itself, and the `tracks` column will hold an array of track objects, like this:

```json
[
  {
    "title": "Artist A - Song X",
    "youtubeId": "abc1234",
    "trackId": "track-1"
  },
  {
    "title": "Artist B - Song Y",
    "youtubeId": "def5678",
    "trackId": "track-2"
  }
]
```

**2. Add a `track_id` column to the `reactions` table:**

This will associate a reaction with a specific track within a post.

```sql
ALTER TABLE reactions
ADD COLUMN track_id TEXT;
```

The `reactions` table will now look like this:

| slug | track_id | emoji | username |
| :--- | :--- | :---- | :--- |
| my-multi-track-post | track-1 | 🔥 | user1 |
| my-multi-track-post | track-2 | ❤️ | user2 |

### 2.2. Code Implementation Plan

The following files will need to be modified to implement the new functionality.

**1. `src/pages/post-new-track.astro`:**

The form for creating new posts needs to be updated to allow adding multiple tracks.

*   The UI should be changed to allow a user to dynamically add and remove tracks to a list.
*   Each track in the list will have its own input fields for title, artist, and YouTube URL.
*   On form submission, the client-side script will gather the data for all tracks, construct the JSON array, and send it to Supabase in the `tracks` column of a new post.

**2. `src/pages/posts/[slug].astro` and `src/components/PostCard.astro`:**

These components need to be updated to render posts with multiple tracks.

*   Instead of rendering a single video, these components will iterate over the `tracks` array from the `post` object.
*   For each track in the array, it will render the video player and the `EmojiReactions` component.
*   The `PostCard.astro` component might show the first track, or a list of tracks in the post.

**3. `src/components/EmojiReactions.astro`:**

This component needs to be modified to handle reactions for a specific track.

*   It will accept a new prop, `trackId`.
*   The Supabase queries for fetching and saving reactions will be updated to use both `slug` and `trackId` to identify the correct set of reactions.

The query to fetch reactions would change from:
`.eq("slug", slug)`
to:
`.eq("slug", slug).eq("track_id", trackId)`

## 3. Data Migration for Existing Posts

For existing posts that have a single track stored in `youtube_url`, we can handle this in the application logic without needing a complex data migration script.

When fetching a post, if the `tracks` column is `null` or empty, but the `youtube_url` column has a value, we can construct a single-item `tracks` array on the fly. This will allow old posts to be rendered correctly with the new components.

## 4. Conclusion

This proposal outlines a clear path to implementing multi-track posts with minimal disruption to the existing application architecture. It provides a flexible and scalable solution for creating more engaging and curated content.
