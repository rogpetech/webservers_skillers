class CreateLessons < ActiveRecord::Migration[7.1]
  def change
    create_table :lessons do |t|
      t.bigint "course_id", null: false
      t.string :title, null: false
      t.text :description

      t.timestamps
    end
  end
end
