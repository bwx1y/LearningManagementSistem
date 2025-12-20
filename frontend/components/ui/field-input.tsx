import {FieldError} from "react-hook-form";
import {Field, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import React, {TextareaHTMLAttributes, useEffect, useState} from "react";
import {Textarea} from "@/components/ui/textarea";
import {Check, ChevronDownIcon, ChevronsUpDown} from "lucide-react"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Calendar} from "@/components/ui/calendar";

interface FieldInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "id"> {
    title: string;
    error?: FieldError;
}

interface FieldTextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "title"> {
    title: string;
    error?: FieldError;
}

interface FieldSelectProps {
    title: string
    options: {
        label: string
        value: string
    }[]
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
}

interface FieldDateProps {
    title: string
    onChange: (value: Date | undefined) => void
    value?: Date | undefined
}

interface FieldDateTimeProps {
    dateTitle: string
    timeTitle: string
    onChange: (value: Date) => void
    className?: string
    error?: string | undefined
    value?: Date | undefined
}

export function FieldInput({title, error, ...rest}: FieldInputProps) {
    const inputId = title.toLowerCase().replace(" ", "_");

    return (
        <Field>
            <FieldLabel htmlFor={inputId}>{title}</FieldLabel>
            <Input id={inputId} {...rest} />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
        </Field>
    );
}

export function FieldTextarea({title, error, ...rest}: FieldTextareaProps) {
    const inputId = title.toLowerCase().replace(" ", "_");

    return (
        <Field>
            <FieldLabel htmlFor={inputId}>{title}</FieldLabel>
            <Textarea
                id={inputId}
                placeholder={"Add any additional " + title.toLowerCase()}
                {...rest}
                className="resize-none"
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
            )}
        </Field>
    );
}

export function FieldSelect(props: FieldSelectProps) {
    const {options, value, onChange, placeholder = "Select an option...", title} = props
    const [open, setOpen] = React.useState(false)
    const selected = options.find((o) => o.value === value)

    return (
        <Field>
            {title && <FieldLabel>{title}</FieldLabel>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selected ? selected.label : placeholder}
                        <ChevronsUpDown className="opacity-50 h-4 w-4"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput placeholder="Search..."/>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                        onChange?.(option.value)
                                        setOpen(false)
                                    }}
                                    className="cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            option.value === value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </Field>
    )
}

export function FieldDate({
                              title,
                              value,
                              onChange,
                          }: FieldDateProps) {
    const inputId = title.toLowerCase().replace(" ", "_")
    const [open, setOpen] = useState(false)

    return (
        <Field className="w-fit">
            <FieldLabel htmlFor={inputId}>{title}</FieldLabel>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-fit">
                        {value ? value.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value}
                        onSelect={(d) => {
                            onChange(d)
                            setOpen(false)
                        }}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}

export function FieldTime({
                              title,
                              error,
                              ...rest
                          }: FieldInputProps) {
    return (
        <Field className="w-32">
            <FieldLabel htmlFor={title} className="px-1">
                {title}
            </FieldLabel>

            <Input
                type="time"
                step="60"
                className="w-32"
                {...rest}
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error.message}
                </p>
            )}
        </Field>
    )
}

export function FieldDateTime({
                                  value,
                                  onChange,
                                  dateTitle,
                                  timeTitle,
                                  className,
                                  error,
                              }: FieldDateTimeProps) {
    const [date, setDate] = useState<Date | undefined>()
    const [time, setTime] = useState<string>("")

    // sync from value (edit mode)
    useEffect(() => {
        if (!value) return

        setDate(value)

        const hh = String(value.getHours()).padStart(2, "0")
        const mm = String(value.getMinutes()).padStart(2, "0")
        setTime(`${hh}:${mm}`)
    }, [value])

    // combine
    useEffect(() => {
        if (!date || !time) return

        const [hours, minutes] = time.split(":")

        const result = new Date(date)
        result.setHours(Number(hours), Number(minutes), 0, 0)

        onChange(result)
    }, [date, time, onChange])

    return (
        <div className={className}>
            <div className="flex gap-4">
                <FieldDate
                    title={dateTitle}
                    value={date}
                    onChange={setDate}
                />

                <FieldTime
                    title={timeTitle}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    )
}
