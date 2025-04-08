import { Review } from '@/components/Community/Classroom/classroomInner/VideoPart/underVideo/reviews/CourseReviews'
export const reviewsData: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Smith',
    userInitials: 'JS',
    rating: 5,
    date: '2025-03-15',
    title: 'Excellent course with in-depth explanations',
    content:
      'This course exceeded my expectations. The instructor explains complex topics in a way thats easy to understand. I particularly enjoyed the practical exercises that reinforced the learning.',
    helpfulCount: 24,
    isHelpful: false,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Johnson',
    userInitials: 'SJ',
    userAvatar: '/api/placeholder/40/40',
    rating: 4,
    date: '2025-03-10',
    title: 'Good content but could use more examples',
    content:
      'The course is well-structured and covers all the necessary topics. However, I would have appreciated more real-world examples to illustrate some of the more complex concepts.',
    helpfulCount: 12,
    isHelpful: false,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Michael Brown',
    userInitials: 'MB',
    rating: 5,
    date: '2025-03-05',
    title: 'Perfect for beginners and intermediate learners',
    content:
      'As someone with some prior knowledge, I found this course struck a good balance between explaining basics for beginners while still providing value for more experienced developers. The instructor is clearly knowledgeable and presents the material clearly.',
    helpfulCount: 18,
    isHelpful: false,
    response: {
      instructorName: 'David Wilson',
      date: '2025-03-06',
      content:
        'Thank you for your kind feedback, Michael! Im glad you found the course valuable despite your prior experience. I try to make my courses accessible to learners at different levels.',
    },
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Emily Davis',
    userInitials: 'ED',
    rating: 3,
    date: '2025-02-28',
    title: 'Good information but outdated in parts',
    content:
      'While the fundamentals are explained well, some of the libraries and tools mentioned are a version or two behind the current releases. It would be great to see an update that covers the latest features and best practices.',
    helpfulCount: 8,
    isHelpful: false,
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Robert Wilson',
    userInitials: 'RW',
    userAvatar: '/api/placeholder/40/40',
    rating: 5,
    date: '2025-02-20',
    title: 'Transformed my understanding of the subject',
    content:
      'This course has completely changed how I approach my projects. The instructor doesnt just teach the "how" but also the "why" behind each concept, which has significantly deepened my understanding. Highly recommended!',
    helpfulCount: 32,
    isHelpful: false,
  },
  {
    id: '6',
    userId: 'user6',
    userName: 'Jennifer Lee',
    userInitials: 'JL',
    rating: 2,
    date: '2025-02-15',
    title: 'Too basic for experienced developers',
    content:
      'The course moves too slowly and spends too much time on concepts that should be prerequisites. If youre an intermediate or advanced developer, you might want to look elsewhere.',
    helpfulCount: 4,
    isHelpful: false,
    response: {
      instructorName: 'David Wilson',
      date: '2025-02-16',
      content:
        'Hi Jennifer, thank you for your honest feedback. This course is primarily designed for beginners to intermediate learners as mentioned in the course description. I do offer more advanced courses that might better suit your experience level. I appreciate you taking the time to share your thoughts.',
    },
  },
]
