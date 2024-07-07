class CreateAttendances < ActiveRecord::Migration[7.1]
  def change
    create_table :attendances do |t|
      t.bigint :lesson_id, null: false
      t.bigint :user_id, null: false
      t.timestamps
    end
  end
end
