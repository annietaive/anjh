import { BookOpen, Clock, Award, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { allLessons as lessons, getAllGrades, getLessonsByGrade } from '../data/allLessons';

interface LessonListProps {
  onSelectLesson: (lessonId: number) => void;
}

export function LessonList({ onSelectLesson }: LessonListProps) {
  // Check if there's a pre-selected grade from localStorage (from HomePage book click)
  const getInitialGrade = (): 6 | 7 | 8 | 9 | 'all' => {
    const storedGrade = localStorage.getItem('selectedGrade');
    if (storedGrade) {
      localStorage.removeItem('selectedGrade'); // Clear after reading
      const grade = parseInt(storedGrade);
      if ([6, 7, 8, 9].includes(grade)) {
        return grade as 6 | 7 | 8 | 9;
      }
    }
    return 'all';
  };

  const [selectedGrade, setSelectedGrade] = useState<6 | 7 | 8 | 9 | 'all'>(getInitialGrade());
  
  const getCompletedStatus = (lessonId: number) => {
    const progress = localStorage.getItem(`lesson_${lessonId}_completed`);
    return progress === 'true';
  };

  const filteredLessons = selectedGrade === 'all' 
    ? lessons 
    : getLessonsByGrade(selectedGrade);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-blue-900 mb-2">Danh sách bài học</h1>
        <p className="text-gray-600">
          Chọn bài học để bắt đầu học từ vựng, ngữ pháp và 4 kỹ năng
        </p>
      </div>

      {/* Grade Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedGrade('all')}
          className={`px-6 py-2 rounded-xl transition-all ${
            selectedGrade === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-blue-50'
          }`}
        >
          Tất cả
        </button>
        {getAllGrades().map((grade) => (
          <button
            key={grade}
            onClick={() => setSelectedGrade(grade)}
            className={`px-6 py-2 rounded-xl transition-all ${
              selectedGrade === grade
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-blue-50'
            }`}
          >
            Lớp {grade}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredLessons.map((lesson) => {
          const isCompleted = getCompletedStatus(lesson.id);
          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson.id)}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-green-500 to-green-600' 
                    : 'bg-gradient-to-br from-blue-500 to-purple-600'
                }`}>
                  {isCompleted ? (
                    <Award className="w-8 h-8 text-white" />
                  ) : (
                    <BookOpen className="w-8 h-8 text-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <div className="text-sm text-blue-600 mb-1">Unit {lesson.unit}</div>
                      <h3 className="text-gray-900 mb-1">{lesson.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{lesson.description}</p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {lesson.topics.map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {lesson.vocabulary.length} từ vựng
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {lesson.exercises.length} bài tập
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {lesson.level}
                    </span>
                  </div>

                  {isCompleted && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
                      <Award className="w-4 h-4" />
                      <span>Đã hoàn thành</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Chưa có bài học nào</p>
        </div>
      )}
    </div>
  );
}