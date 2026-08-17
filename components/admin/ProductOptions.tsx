"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export type ProductOption = {
  name: string;
  values: string[];
};

type ProductOptionsProps = {
  options: ProductOption[];
  onChange: (options: ProductOption[]) => void;
};

export default function ProductOptions({
  options,
  onChange,
}: ProductOptionsProps) {
  const addOption = () => {
    onChange([
      ...options,
      {
        name: "",
        values: [""],
      },
    ]);
  };

  const removeOption = (optionIndex: number) => {
    onChange(
      options.filter(
        (_, index) => index !== optionIndex
      )
    );
  };

  const updateOptionName = (
    optionIndex: number,
    name: string
  ) => {
    const updated = [...options];

    updated[optionIndex] = {
      ...updated[optionIndex],
      name,
    };

    onChange(updated);
  };

  const addValue = (optionIndex: number) => {
    const updated = [...options];

    updated[optionIndex] = {
      ...updated[optionIndex],
      values: [
        ...updated[optionIndex].values,
        "",
      ],
    };

    onChange(updated);
  };

  const removeValue = (
    optionIndex: number,
    valueIndex: number
  ) => {
    const updated = [...options];

    updated[optionIndex] = {
      ...updated[optionIndex],
      values: updated[optionIndex].values.filter(
        (_, index) => index !== valueIndex
      ),
    };

    onChange(updated);
  };

  const updateValue = (
    optionIndex: number,
    valueIndex: number,
    value: string
  ) => {
    const updated = [...options];

    const values = [
      ...updated[optionIndex].values,
    ];

    values[valueIndex] = value;

    updated[optionIndex] = {
      ...updated[optionIndex],
      values,
    };

    onChange(updated);
  };

  return (
    <section className="rounded-3xl border border-black/5 bg-white/75 p-5 shadow-sm backdrop-blur-xl sm:p-7">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div>
          <h2 className="text-lg font-black">
            Product Options
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Add sizes, colors or other options customers can select.
          </p>
        </div>

        <button
          type="button"
          onClick={addOption}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold transition hover:bg-gray-50"
        >
          <Plus size={16} />
          Add Option
        </button>

      </div>

      {/* Empty state */}
      {options.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-gray-50/70 p-8 text-center">

          <p className="text-sm font-semibold text-gray-600">
            No options added
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Add options such as Size, Color, Strap or Dial Color.
          </p>

          <button
            type="button"
            onClick={addOption}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white"
          >
            <Plus size={14} />
            Add your first option
          </button>

        </div>
      )}

      {/* Options */}
      <div className="mt-6 space-y-5">

        {options.map((option, optionIndex) => (
          <div
            key={optionIndex}
            className="rounded-2xl border border-black/5 bg-gray-50/70 p-4 sm:p-5"
          >

            {/* Option header */}
            <div className="flex items-start gap-3">

              <div className="flex-1">

                <label
                  htmlFor={`option-${optionIndex}`}
                  className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400"
                >
                  Option Name
                </label>

                <input
                  id={`option-${optionIndex}`}
                  type="text"
                  value={option.name}
                  onChange={(event) =>
                    updateOptionName(
                      optionIndex,
                      event.target.value
                    )
                  }
                  placeholder="Size"
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
                />

              </div>

              <button
                type="button"
                onClick={() =>
                  removeOption(optionIndex)
                }
                aria-label="Remove option"
                className="mt-6 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-100"
              >
                <Trash2 size={17} />
              </button>

            </div>

            {/* Values */}
            <div className="mt-5">

              <div className="mb-3 flex items-center justify-between">

                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Values
                </label>

                <button
                  type="button"
                  onClick={() =>
                    addValue(optionIndex)
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  <Plus size={14} />
                  Add Value
                </button>

              </div>

              <div className="space-y-2">

                {option.values.map(
                  (value, valueIndex) => (
                    <div
                      key={valueIndex}
                      className="flex gap-2"
                    >

                      <input
                        type="text"
                        value={value}
                        onChange={(event) =>
                          updateValue(
                            optionIndex,
                            valueIndex,
                            event.target.value
                          )
                        }
                        placeholder={
                          option.name
                            .toLowerCase()
                            .includes("size")
                            ? "8"
                            : "Black"
                        }
                        className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/5"
                      />

                      {option.values.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            removeValue(
                              optionIndex,
                              valueIndex
                            )
                          }
                          aria-label="Remove value"
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-black/5 bg-white text-gray-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}

                    </div>
                  )
                )}

              </div>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}