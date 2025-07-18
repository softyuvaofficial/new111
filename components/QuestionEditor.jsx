import React, { useState, useEffect } from "react";

const QUESTION_TYPES = [
  { value: "mcq_single", label: "MCQ (Single Correct)" },
  { value: "mcq_multiple", label: "MCQ (Multiple Correct)" },
  { value: "match_column", label: "Match the Column" },
  { value: "fill_blank", label: "Fill in the Blanks" },
  { value: "passage", label: "Paragraph/Passage Based" },
  { value: "image_mcq", label: "Image Based MCQ" },
];

const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

export default function QuestionEditor({ initialData = {}, onSave }) {
  const [questionType, setQuestionType] = useState(initialData.type || "mcq_single");
  const [questionText, setQuestionText] = useState(initialData.text || "");
  const [options, setOptions] = useState(initialData.options || ["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState(initialData.correctAnswers || []);
  const [tags, setTags] = useState(initialData.tags || []);
  const [difficulty, setDifficulty] = useState(initialData.difficulty || "Medium");
  const [explanation, setExplanation] = useState(initialData.explanation || "");
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [passageText, setPassageText] = useState(initialData.passage || "");

  // Handle adding/removing tags (simple comma separated)
  const handleTagsChange = (e) => {
    const input = e.target.value;
    const tagsArray = input.split(",").map((t) => t.trim()).filter(Boolean);
    setTags(tagsArray);
  };

  // Handle option text change
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  // Handle correct answer selection
  const handleCorrectAnswerChange = (index) => {
    if (questionType === "mcq_multiple") {
      // Toggle multiple selection
      if (correctAnswers.includes(index)) {
        setCorrectAnswers(correctAnswers.filter((i) => i !== index));
      } else {
        setCorrectAnswers([...correctAnswers, index]);
      }
    } else {
      // Single selection
      setCorrectAnswers([index]);
    }
  };

  // Add new option (for MCQs)
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // Remove option by index
  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
    setCorrectAnswers(correctAnswers.filter((i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      type: questionType,
      text: questionText,
      options,
      correctAnswers,
      tags,
      difficulty,
      explanation,
      imageUrl,
      passage: passageText,
    };
    onSave && onSave(questionData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white rounded-md shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold">Question Editor</h2>

      {/* Question Type */}
      <div>
        <label className="block font-medium mb-1">Question Type</label>
        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        >
          {QUESTION_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Question Text */}
      <div>
        <label className="block font-medium mb-1">Question Text</label>
        <textarea
          rows={4}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
          placeholder="Enter the question here"
        />
      </div>

      {/* Passage Text (only for passage type) */}
      {questionType === "passage" && (
        <div>
          <label className="block font-medium mb-1">Passage Text</label>
          <textarea
            rows={5}
            value={passageText}
            onChange={(e) => setPassageText(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter the passage or paragraph here"
          />
        </div>
      )}

      {/* Image URL (only for image_mcq) */}
      {questionType === "image_mcq" && (
        <div>
          <label className="block font-medium mb-1">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter image URL"
          />
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Question related"
              className="mt-2 max-h-48 object-contain"
            />
          )}
        </div>
      )}

      {/* Options (for MCQ and match column) */}
      {(questionType === "mcq_single" ||
        questionType === "mcq_multiple" ||
        questionType === "match_column") && (
        <div>
          <label className="block font-medium mb-2">Options</label>
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center space-x-3 mb-2">
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="flex-grow border border-gray-300 rounded px-3 py-1"
                placeholder={`Option ${idx + 1}`}
                required
              />
              <label className="flex items-center space-x-1">
                <input
                  type={
                    questionType === "mcq_multiple" ? "checkbox" : "radio"
                  }
                  name="correctAnswer"
                  checked={correctAnswers.includes(idx)}
                  onChange={() => handleCorrectAnswerChange(idx)}
                />
                <span className="ml-1 text-sm">Correct</span>
              </label>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="text-red-600 hover:text-red-800"
                  aria-label={`Remove option ${idx + 1}`}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mt-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Option
          </button>
        </div>
      )}

      {/* Tags */}
      <div>
        <label className="block font-medium mb-1">
          Tags (comma separated)
        </label>
        <input
          type="text"
          value={tags.join(", ")}
          onChange={handleTagsChange}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="e.g. math, algebra, easy"
        />
      </div>

      {/* Difficulty */}
      <div>
        <label className="block font-medium mb-1">Difficulty Level</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          {DIFFICULTY_LEVELS.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Explanation */}
      <div>
        <label className="block font-medium mb-1">Explanation / Solution</label>
        <textarea
          rows={3}
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Explain the answer here"
        />
      </div>

      <button
        type="submit"
        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Save Question
      </button>
    </form>
  );
}
