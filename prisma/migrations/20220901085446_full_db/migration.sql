/*
  Warnings:

  - You are about to drop the column `Ans_Pic_UNC` on the `T_Answers` table. All the data in the column will be lost.
  - You are about to drop the column `Ans_image` on the `T_Answers` table. All the data in the column will be lost.
  - You are about to drop the column `TRIAL956` on the `T_Answers` table. All the data in the column will be lost.
  - You are about to drop the column `Qus_image` on the `T_Questions` table. All the data in the column will be lost.
  - You are about to drop the column `TRIAL959` on the `T_Questions` table. All the data in the column will be lost.
  - You are about to drop the column `TRIAL959` on the `T_Categories` table. All the data in the column will be lost.
  - You are about to drop the column `flag` on the `T_Categories` table. All the data in the column will be lost.
  - You are about to drop the column `Exm_Cat_ID` on the `T_Exams` table. All the data in the column will be lost.
  - You are about to drop the column `TRIAL959` on the `T_Exams` table. All the data in the column will be lost.
  - Made the column `Cat_Name` on table `T_Categories` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "Battries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "user_id" INTEGER,
    "weapon_id" INTEGER,
    CONSTRAINT "Battries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "T_Categories" ("Cat_ID") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Battary_Exam" (
    "battary_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("battary_id", "exam_id"),
    CONSTRAINT "Battary_Exam_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "T_Exams" ("Exm_ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Battary_Exam_battary_id_fkey" FOREIGN KEY ("battary_id") REFERENCES "Battries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Assign" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exam_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Answers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exam_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer_id" INTEGER NOT NULL,
    "examiner_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    CONSTRAINT "Answers_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "T_Answers" ("Ans_ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answers_examiner_id_fkey" FOREIGN KEY ("examiner_id") REFERENCES "Examiners" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answers_old" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "exam_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer_id" INTEGER NOT NULL,
    "examiner_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration" INTEGER,
    CONSTRAINT "Answers_old_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "T_Answers" ("Ans_ID") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Answers_old_examiner_id_fkey" FOREIGN KEY ("examiner_id") REFERENCES "Examiners" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "reception" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "degree" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "details" TEXT,
    "case" INTEGER NOT NULL DEFAULT 2,
    "new" INTEGER NOT NULL DEFAULT 1,
    "update" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "description" TEXT,
    "operation_type" TEXT,
    "type" TEXT,
    "oldVal" TEXT,
    "newVal" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "T_Categories" ("Cat_ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomExam" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "examiner_id" INTEGER NOT NULL,
    "exam_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomExam_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "T_Exams" ("Exm_ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CustomExam_examiner_id_fkey" FOREIGN KEY ("examiner_id") REFERENCES "Examiners" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Interview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "examiner_id" INTEGER NOT NULL,
    "parent_job" TEXT NOT NULL,
    "siblings_num" INTEGER NOT NULL,
    "family_relation" TEXT NOT NULL,
    "complaint" TEXT NOT NULL,
    "appearance" TEXT NOT NULL,
    "focus_ability" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "speaking_disorder" TEXT NOT NULL,
    "medicine_type" TEXT NOT NULL,
    "has_medical_history" TEXT NOT NULL,
    "hospital_name" TEXT,
    "drugs_history" TEXT NOT NULL,
    "drug_type" TEXT,
    "final_opinion" TEXT NOT NULL,
    "examiner_status" TEXT NOT NULL,
    "final_hospital_result" TEXT NOT NULL,
    "order_brothers" INTEGER,
    "parent_rel" INTEGER,
    "rel_between_parents" INTEGER,
    "family_income" INTEGER,
    "family_medical" INTEGER,
    "personal_medical" INTEGER,
    "half_brothers" INTEGER,
    "complaint_f" TEXT,
    "transReason" INTEGER,
    "moving" INTEGER,
    "faceExprission" INTEGER,
    "timeAware" INTEGER,
    "situationAware" INTEGER,
    "judgeAbility" INTEGER,
    "awareDisorder" INTEGER,
    "thinkDisorder" INTEGER,
    "appetite" INTEGER,
    "sleeping" INTEGER,
    "smoking" INTEGER,
    "prayer" INTEGER,
    "interviewer_opinion" TEXT,
    "historyDate" DATETIME,
    "recommendation" INTEGER,
    "recommendation_res" INTEGER,
    "recommendation_summary" TEXT,
    "interviewer" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Interview_examiner_id_fkey" FOREIGN KEY ("examiner_id") REFERENCES "Examiners" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Weapons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "V_SELAH" TEXT,
    "MIL_SELAH" TEXT
);

-- CreateTable
CREATE TABLE "ArmyNames" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "TamarkzNames" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "UnitNames" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "ExpectedPlan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expcted" INTEGER,
    "actual_arrive" INTEGER,
    "user_id" INTEGER,
    CONSTRAINT "ExpectedPlan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "T_Categories" ("Cat_ID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_T_Answers" (
    "Ans_Qus_ID" INTEGER NOT NULL,
    "Ans_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Ans_Is_Pic" BOOLEAN NOT NULL DEFAULT false,
    "Ans_Text" TEXT,
    "Ans_Value" REAL,
    "Ans_audio" BLOB,
    "Ans_Cat" TEXT,
    CONSTRAINT "T_Answers_Ans_Qus_ID_fkey" FOREIGN KEY ("Ans_Qus_ID") REFERENCES "T_Questions" ("Qus_ID") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_T_Answers" ("Ans_Cat", "Ans_ID", "Ans_Is_Pic", "Ans_Qus_ID", "Ans_Text", "Ans_Value", "Ans_audio") SELECT "Ans_Cat", "Ans_ID", "Ans_Is_Pic", "Ans_Qus_ID", "Ans_Text", "Ans_Value", "Ans_audio" FROM "T_Answers";
DROP TABLE "T_Answers";
ALTER TABLE "new_T_Answers" RENAME TO "T_Answers";
CREATE TABLE "new_Examiners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "national_id" TEXT NOT NULL,
    "triple_number" TEXT,
    "name" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "barcode" TEXT,
    "sold_id" TEXT,
    "mohafza_code" INTEGER,
    "qualification_code" INTEGER,
    "marital_state" TEXT,
    "educational_degree" TEXT,
    "user_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" DATETIME,
    "battary_id" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "again" BOOLEAN NOT NULL DEFAULT false,
    "UNIT_NAME" TEXT,
    "GEHA_NAME" TEXT,
    "TAMARKZ_NAME" TEXT,
    "UNIT_ARMY_NAME" TEXT,
    "ARMY_TAGNEED_NAME" TEXT,
    "isNoticed" BOOLEAN NOT NULL DEFAULT false,
    "isNoticedAgain" BOOLEAN NOT NULL DEFAULT false,
    "nextFollowDate" DATETIME,
    "numFollowUps" INTEGER NOT NULL DEFAULT 0,
    "t_CategoriesCat_ID" INTEGER,
    CONSTRAINT "Examiners_t_CategoriesCat_ID_fkey" FOREIGN KEY ("t_CategoriesCat_ID") REFERENCES "T_Categories" ("Cat_ID") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Examiners" ("barcode", "created_at", "id", "name", "national_id", "sold_id", "stage", "triple_number") SELECT "barcode", "created_at", "id", "name", "national_id", "sold_id", "stage", "triple_number" FROM "Examiners";
DROP TABLE "Examiners";
ALTER TABLE "new_Examiners" RENAME TO "Examiners";
CREATE UNIQUE INDEX "Examiners_national_id_key" ON "Examiners"("national_id");
CREATE UNIQUE INDEX "Examiners_triple_number_key" ON "Examiners"("triple_number");
CREATE UNIQUE INDEX "Examiners_barcode_key" ON "Examiners"("barcode");
CREATE UNIQUE INDEX "Examiners_sold_id_key" ON "Examiners"("sold_id");
CREATE TABLE "new_T_Questions" (
    "Qus_Exm_ID" INTEGER NOT NULL,
    "Qus_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Qus_Is_Pic" BOOLEAN NOT NULL DEFAULT false,
    "Qus_Text" TEXT,
    "Qus_Pic_UNC" TEXT,
    "Qus_audio" BLOB,
    "Qus_Order_Cat" INTEGER,
    CONSTRAINT "T_Questions_Qus_Exm_ID_fkey" FOREIGN KEY ("Qus_Exm_ID") REFERENCES "T_Exams" ("Exm_ID") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_T_Questions" ("Qus_Exm_ID", "Qus_ID", "Qus_Is_Pic", "Qus_Order_Cat", "Qus_Pic_UNC", "Qus_Text", "Qus_audio") SELECT "Qus_Exm_ID", "Qus_ID", "Qus_Is_Pic", "Qus_Order_Cat", "Qus_Pic_UNC", "Qus_Text", "Qus_audio" FROM "T_Questions";
DROP TABLE "T_Questions";
ALTER TABLE "new_T_Questions" RENAME TO "T_Questions";
CREATE TABLE "new_T_Categories" (
    "Cat_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Cat_Name" TEXT NOT NULL,
    "isLogin" BOOLEAN NOT NULL DEFAULT false,
    "type" INTEGER NOT NULL DEFAULT 2,
    "host" TEXT,
    "username" TEXT,
    "zoom" INTEGER NOT NULL DEFAULT 100,
    "password" TEXT NOT NULL DEFAULT '$2a$08$oAi0Hoi5q949I/bLp9QxkeHvakgwmbApRkxVOU2YDEoYSaXoyU6My'
);
INSERT INTO "new_T_Categories" ("Cat_ID", "Cat_Name") SELECT "Cat_ID", "Cat_Name" FROM "T_Categories";
DROP TABLE "T_Categories";
ALTER TABLE "new_T_Categories" RENAME TO "T_Categories";
CREATE UNIQUE INDEX "T_Categories_Cat_Name_key" ON "T_Categories"("Cat_Name");
CREATE TABLE "new_T_Exams" (
    "Exm_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Exm_Name" TEXT,
    "Exm_Display_Name" TEXT DEFAULT 'ss',
    "Exm_Duration_In_Mins" INTEGER DEFAULT 0,
    "Exm_Given_Questions_Count" INTEGER DEFAULT -1,
    "Exm_Description" TEXT DEFAULT 'ss',
    "Exm_Is_Custom" BOOLEAN NOT NULL DEFAULT false,
    "Exm_Is_Computerized" BOOLEAN NOT NULL DEFAULT false,
    "Exm_mlhoz" INTEGER,
    "Exm_mokser" INTEGER,
    "show" BOOLEAN NOT NULL DEFAULT true,
    "category" TEXT DEFAULT 'نفسي',
    "random" TEXT DEFAULT 'عشوائي'
);
INSERT INTO "new_T_Exams" ("Exm_Description", "Exm_Display_Name", "Exm_Duration_In_Mins", "Exm_Given_Questions_Count", "Exm_ID", "Exm_Is_Computerized", "Exm_Is_Custom", "Exm_Name", "Exm_mlhoz", "Exm_mokser") SELECT "Exm_Description", "Exm_Display_Name", "Exm_Duration_In_Mins", "Exm_Given_Questions_Count", "Exm_ID", "Exm_Is_Computerized", "Exm_Is_Custom", "Exm_Name", "Exm_mlhoz", "Exm_mokser" FROM "T_Exams";
DROP TABLE "T_Exams";
ALTER TABLE "new_T_Exams" RENAME TO "T_Exams";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Battries_name_key" ON "Battries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Battries_user_id_key" ON "Battries"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Battries_weapon_id_key" ON "Battries"("weapon_id");

-- CreateIndex
CREATE UNIQUE INDEX "Assign_exam_id_key" ON "Assign"("exam_id");

-- CreateIndex
CREATE UNIQUE INDEX "Answers_examiner_id_question_id_key" ON "Answers"("examiner_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "Answers_old_examiner_id_question_id_key" ON "Answers_old"("examiner_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "CustomExam_examiner_id_exam_id_key" ON "CustomExam"("examiner_id", "exam_id");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_examiner_id_key" ON "Interview"("examiner_id");
