import IStaticObjectManager, { staticObjectManagerDefaults, staticObjectManagerSchema } from "./IStaticObjectManaget"
import ITexturedBasic, { texturedBasicDefaults, texturedBasicSchema } from "./ITexturedBasic"
import ITexturedStandard, { texturedStandardDefaults, texturedStandardSchema } from "./ITexturedStandard"
import { ExtractProps } from "./utils/extractProps"

export default interface IFound extends IStaticObjectManager, ITexturedBasic, ITexturedStandard {}

export const foundSchema: Required<ExtractProps<IFound>> = {
    ...staticObjectManagerSchema,
    ...texturedBasicSchema,
    ...texturedStandardSchema
}

export const foundDefaults: IFound = {
    ...staticObjectManagerDefaults,
    ...texturedBasicDefaults,
    ...texturedStandardDefaults
}