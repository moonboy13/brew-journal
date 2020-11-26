using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models
{
	public class ModelBase
	{
		//-- Seems kinda messy to do an identifier this way, over engineered. Goal is to see if this allows
		//-- for easier abstraction between different I/O interfaces. Not constrained anymore by needing to
		//-- keep in sync with a specific database ID as long as there is some identifier for the object unique
		//-- to the interface.
		public virtual object Id { get; set; }
	}
}
