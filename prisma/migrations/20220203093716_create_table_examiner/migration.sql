-- CreateTable
CREATE TABLE "T_Answers" (
    "Ans_Qus_ID" INTEGER NOT NULL,
    "Ans_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Ans_Is_Pic" BOOLEAN NOT NULL DEFAULT false,
    "Ans_Text" TEXT,
    "Ans_Pic_UNC" TEXT,
    "Ans_Value" REAL,
    "Ans_audio" BLOB,
    "Ans_image" BLOB,
    "Ans_Cat" TEXT,
    "TRIAL956" TEXT,
    CONSTRAINT "T_Answers_Ans_Qus_ID_fkey" FOREIGN KEY ("Ans_Qus_ID") REFERENCES "T_Questions" ("Qus_ID") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "T_Categories" (
    "Cat_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Cat_Name" TEXT,
    "flag" BOOLEAN NOT NULL DEFAULT false,
    "TRIAL959" TEXT
);

-- CreateTable
CREATE TABLE "T_Exams" (
    "Exm_Cat_ID" INTEGER,
    "Exm_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Exm_Name" TEXT,
    "Exm_Display_Name" TEXT,
    "Exm_Duration_In_Mins" INTEGER DEFAULT 0,
    "Exm_Given_Questions_Count" INTEGER DEFAULT -1,
    "Exm_Description" TEXT,
    "Exm_Is_Custom" BOOLEAN NOT NULL DEFAULT false,
    "Exm_Is_Computerized" BOOLEAN NOT NULL DEFAULT false,
    "Exm_mlhoz" INTEGER,
    "Exm_mokser" INTEGER,
    "TRIAL959" TEXT
);

-- CreateTable
CREATE TABLE "T_Questions" (
    "Qus_Exm_ID" INTEGER NOT NULL,
    "Qus_ID" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Qus_Is_Pic" BOOLEAN NOT NULL DEFAULT false,
    "Qus_Text" TEXT,
    "Qus_Pic_UNC" TEXT,
    "Qus_audio" BLOB,
    "Qus_image" BLOB,
    "Qus_Order_Cat" INTEGER,
    "TRIAL959" TEXT
);

-- CreateTable
CREATE TABLE "Examiners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "national_id" TEXT NOT NULL,
    "triple_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "barcode" TEXT,
    "sold_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Examiners_national_id_key" ON "Examiners"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "Examiners_triple_number_key" ON "Examiners"("triple_number");

-- CreateIndex
CREATE UNIQUE INDEX "Examiners_barcode_key" ON "Examiners"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "Examiners_sold_id_key" ON "Examiners"("sold_id");
