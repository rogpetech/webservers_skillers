course = Course.create(
  title: "Curso Ruby",
  description: "O curso mágico de ruby é infitamente legal"
)

lesson = Lesson.create(
  title: "Aula 1",
  description: "Aula de inicio de carreira",
  course_id: course.id
)

Attendance.create(
  lesson_id: lesson.id,
  user_id: 1
)

Course.create(
  title: "Curso React",
  description: "O curso mágico de react é infitamente legal"
)
